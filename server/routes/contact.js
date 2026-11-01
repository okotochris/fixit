const express = require("express");
const sendEmail = require("../service/brevo");
const db = require('../database/db')
const router = express.Router();

// Prevent HTML injection in email
const escapeHTML = (value = "") =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char],
  );

router.post("/admin/emailservice", async (req, res) => {
  try {
    const { fullname, email, message } = req.body;
    const messageInfo = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; background: #f8fafc; color: #1e293b;">

            <div style="background: #f97316; padding: 25px; border-radius: 12px 12px 0 0; color: white;">
                <h2 style="margin: 0;">New Contact Message</h2>
                <p style="margin: 8px 0 0; font-size: 14px;">
                    You have received a new message through the ServiceHub website.
                </p>
            </div>

            <div style="background: white; padding: 25px; border: 1px solid #e2e8f0;">

                <h3 style="color: #f97316; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
                    Sender Information
                </h3>

                <p><strong>Full Name:</strong> ${escapeHTML(fullname)}</p>
                <p><strong>Email Address:</strong> ${escapeHTML(email)}</p>

                <h3 style="color: #f97316; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 30px;">
                    Message
                </h3>

                <div style="background: #f8fafc; padding: 15px; border-radius: 8px; line-height: 1.7; white-space: pre-wrap;">
                    ${escapeHTML(message)}
                </div>

            </div>

            <div style="background: #1e293b; color: #cbd5e1; padding: 18px; text-align: center; border-radius: 0 0 12px 12px; font-size: 12px;">
                <p style="margin: 0;">ServiceHub | Contact Enquiry</p>
                <p style="margin: 5px 0 0;">Please respond to the sender as soon as possible.</p>
            </div>

        </div>
        `;
    await sendEmail("khrystaltech@gmail.com", messageInfo);
    res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/hirer-supervisor", async (req, res) => {
  try {
    const {
      id,
      country,
      projectType,
      projectLocation,
      projectStatus,
      supervisionType,
      budget,
      description,
      contactMethod,
    } = req.body;

    // Get authenticated user's ID
    const userId = id;

    // Get user details from users table
    const userResult = await db.query(
      `SELECT fullname, email, phone
             FROM users
             WHERE id = $1`,
      [userId],
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { fullname, email, phone } = userResult.rows[0];

    // Validate required fields
    if (
      !country ||
      !projectType ||
      !projectLocation ||
      !projectStatus ||
      !supervisionType ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    // Insert supervisor request
    const result = await db.query(
      `INSERT INTO supervisor (
                userId,
                country,
                projectType,
                projectLocation,
                projectStatus,
                supervisionType,
                budget,
                description,
                contactMethod
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING id`,
      [
        userId,
        country,
        projectType,
        projectLocation,
        projectStatus,
        supervisionType,
        budget || null,
        description,
        contactMethod || "WhatsApp",
      ],
    );

    const reqId = result.rows[0].id;

    // Generate unique slug
    const slugName = fullname
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    const slug = `${slugName}-${reqId}`;

    // Save slug
    await db.query(
      `UPDATE supervisor
             SET useslug = $1
             WHERE id = $2`,
      [slug, reqId],
    );

    const messageInfo = `
        <div style="font-family: Arial, sans-serif; max-width: 650px; margin: auto; padding: 25px; background: #f8fafc; color: #1e293b;">

            <div style="background: #f97316; padding: 25px; border-radius: 12px 12px 0 0; color: white;">
                <h2 style="margin: 0;">New Project Supervision Request</h2>
                <p style="margin: 8px 0 0; font-size: 14px;">
                    A client has submitted a request to hire a project supervisor.
                </p>
            </div>

            <div style="background: white; padding: 25px; border: 1px solid #e2e8f0;">

                <h3 style="color: #f97316;">Client Information</h3>

                <p><strong>Name:</strong> ${escapeHTML(fullname)}</p>
                <p><strong>Email:</strong> ${escapeHTML(email)}</p>
                <p><strong>Phone:</strong> ${escapeHTML(phone)}</p>
                <p><strong>Country:</strong> ${escapeHTML(country)}</p>
                <p><strong>Preferred Contact:</strong> ${escapeHTML(contactMethod || "WhatsApp")}</p>

                <h3 style="color: #f97316; margin-top: 25px;">Project Information</h3>

                <p><strong>Project Type:</strong> ${escapeHTML(projectType)}</p>
                <p><strong>Project Location:</strong> ${escapeHTML(projectLocation)}</p>
                <p><strong>Project Status:</strong> ${escapeHTML(projectStatus)}</p>
                <p><strong>Supervision Type:</strong> ${escapeHTML(supervisionType)}</p>
                <p><strong>Budget:</strong> ${escapeHTML(budget || "Not provided")}</p>

                <h3 style="color: #f97316; margin-top: 25px;">Project Description</h3>

                <p>${escapeHTML(description)}</p>

                <div style="margin-top: 30px;">
                    <a href="https://servicehub.space/supervisor_project_details/${encodeURIComponent(slug)}"
                       style="background: #f97316; color: white; padding: 12px 22px; text-decoration: none; border-radius: 8px; display: inline-block;">
                        View Request
                    </a>
                </div>

            </div>
        </div>`;

    // Send notification email
    try {
      await sendEmail("khrystaltech@gmail.com", messageInfo);
    } catch (emailError) {
      console.error("Supervisor notification email failed:", emailError);
    }

    return res.status(201).json({
      message: "Supervisor request submitted successfully",
      id: reqId,
      slug,
    });
  } catch (error) {
    console.error("Supervisor request error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
});

module.exports = router;
