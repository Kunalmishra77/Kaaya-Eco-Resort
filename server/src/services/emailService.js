// d:/kaaya eco resort/server/src/services/emailService.js
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host:   process.env.EMAIL_HOST  || 'smtp.gmail.com',
  port:   Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
})

const FROM = process.env.EMAIL_FROM || 'Kaaya Eco Resort <bookings@kaayaecoresort.com>'

function formatDateSL(date) {
  return new Date(date).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })
}

function formatPriceLKR(amount) {
  return `LKR ${Number(amount).toLocaleString('en-LK')}`
}

// ── Booking confirmation to guest ────────────────────────────────────────────
export async function sendBookingConfirmation(booking) {
  const nights = Math.round(
    (new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24)
  )

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8" /><title>Booking Confirmed – Kaaya Eco Resort</title></head>
    <body style="margin:0;padding:0;background:#F5F0E8;font-family:'DM Sans',Arial,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;padding:40px 20px;">
        <tr><td>
          <table width="600" align="center" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:2px;overflow:hidden;max-width:600px;">

            <!-- Header -->
            <tr>
              <td style="background:#1B4332;padding:32px 40px;">
                <h1 style="color:#F5F0E8;font-family:Georgia,serif;font-size:26px;margin:0;font-weight:600;">
                  Kaaya Eco Resort
                </h1>
                <p style="color:#C8A96E;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:6px 0 0;">
                  Yala · Sri Lanka
                </p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px;">
                <p style="color:#1B4332;font-size:22px;font-family:Georgia,serif;font-weight:600;margin:0 0 8px;">
                  Booking Confirmed ✓
                </p>
                <p style="color:#5C3D1E;font-size:15px;margin:0 0 28px;line-height:1.6;">
                  Dear ${booking.guestName},<br/>
                  Your booking at Kaaya Eco Resort has been confirmed. We look forward to welcoming you to Yala's Wild Heart.
                </p>

                <!-- Booking details box -->
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#F5F0E8;border-radius:2px;border:1px solid #8FAF91;margin-bottom:28px;">
                  <tr><td style="padding:24px;">
                    <p style="font-size:11px;color:#8FAF91;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:0 0 16px;">Booking Details</p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E99;font-size:13px;width:40%;">Reference</td>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E;font-size:13px;font-weight:600;">${booking.id.slice(-8).toUpperCase()}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E99;font-size:13px;">Room</td>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E;font-size:13px;font-weight:600;">${booking.room?.name || 'Your selected room'}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E99;font-size:13px;">Check-in</td>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E;font-size:13px;font-weight:600;">${formatDateSL(booking.checkIn)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E99;font-size:13px;">Check-out</td>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E;font-size:13px;font-weight:600;">${formatDateSL(booking.checkOut)}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E99;font-size:13px;">Duration</td>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E;font-size:13px;font-weight:600;">${nights} night${nights !== 1 ? 's' : ''}</td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E99;font-size:13px;">Guests</td>
                        <td style="padding:8px 0;border-bottom:1px solid #8FAF9140;color:#5C3D1E;font-size:13px;font-weight:600;">${booking.adults} adults${booking.children > 0 ? `, ${booking.children} children` : ''}</td>
                      </tr>
                      <tr>
                        <td style="padding:12px 0 0;color:#5C3D1E;font-size:14px;font-weight:600;">Total Paid</td>
                        <td style="padding:12px 0 0;color:#1B4332;font-size:18px;font-family:Georgia,serif;font-weight:700;">${formatPriceLKR(booking.totalPrice)}</td>
                      </tr>
                    </table>
                  </td></tr>
                </table>

                ${booking.specialRequests ? `
                <p style="color:#5C3D1E99;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:600;margin:0 0 8px;">Special Requests</p>
                <p style="color:#5C3D1E;font-size:14px;background:#F5F0E8;padding:16px;border-radius:2px;margin:0 0 28px;">${booking.specialRequests}</p>
                ` : ''}

                <!-- What to expect -->
                <p style="color:#1B4332;font-size:16px;font-family:Georgia,serif;font-weight:600;margin:0 0 12px;">What to Expect</p>
                <ul style="color:#5C3D1E;font-size:14px;line-height:1.8;padding-left:20px;margin:0 0 28px;">
                  <li>Our team will contact you 48 hours before arrival to confirm arrangements.</li>
                  <li>Safari schedules can be arranged in advance — please let us know your preferences.</li>
                  <li>Check-in is from 2:00 PM. Early check-in available on request (subject to availability).</li>
                  <li>Check-out is by 11:00 AM. Late check-out available on request.</li>
                </ul>

                <p style="color:#5C3D1E;font-size:14px;line-height:1.6;margin:0 0 28px;">
                  For any questions, reply to this email or contact us at:<br/>
                  📞 <a href="tel:+94771234567" style="color:#1B4332;">+94 77 123 4567</a><br/>
                  ✉️ <a href="mailto:bookings@kaayaecoresort.com" style="color:#1B4332;">bookings@kaayaecoresort.com</a>
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#1B4332;padding:24px 40px;text-align:center;">
                <p style="color:#F5F0E880;font-size:12px;margin:0;">
                  © ${new Date().getFullYear()} Kaaya Eco Resort · Yala, Sri Lanka
                </p>
                <p style="color:#F5F0E850;font-size:11px;margin:6px 0 0;">
                  <a href="https://www.kaayaecoresort.com" style="color:#C8A96E;text-decoration:none;">www.kaayaecoresort.com</a>
                </p>
              </td>
            </tr>

          </table>
        </td></tr>
      </table>
    </body>
    </html>
  `

  return transporter.sendMail({
    from:    FROM,
    to:      booking.guestEmail,
    subject: `Booking Confirmed – ${booking.room?.name || 'Kaaya Eco Resort'} · ${formatDateSL(booking.checkIn)}`,
    html,
  })
}

// ── Inquiry acknowledgment ───────────────────────────────────────────────────
export async function sendInquiryAck(inquiry) {
  const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:40px 20px;background:#F5F0E8;font-family:'DM Sans',Arial,sans-serif;">
      <table width="560" align="center" style="background:#fff;border-radius:2px;overflow:hidden;max-width:560px;">
        <tr><td style="background:#1B4332;padding:28px 36px;">
          <h1 style="color:#F5F0E8;font-family:Georgia,serif;font-size:22px;margin:0;">Kaaya Eco Resort</h1>
          <p style="color:#C8A96E;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:4px 0 0;">Yala · Sri Lanka</p>
        </td></tr>
        <tr><td style="padding:36px;">
          <p style="color:#5C3D1E;font-size:15px;line-height:1.7;margin:0 0 16px;">
            Dear ${inquiry.name},<br/><br/>
            Thank you for getting in touch. We've received your message and will reply within 24 hours.
          </p>
          <p style="color:#5C3D1E99;font-size:13px;background:#F5F0E8;padding:16px;border-radius:2px;margin:0 0 20px;">
            <strong>Your message:</strong><br/>${inquiry.message}
          </p>
          <p style="color:#5C3D1E;font-size:14px;margin:0;">
            For urgent enquiries: <a href="tel:+94771234567" style="color:#1B4332;">+94 77 123 4567</a>
          </p>
        </td></tr>
        <tr><td style="background:#1B4332;padding:20px 36px;text-align:center;">
          <p style="color:#F5F0E850;font-size:11px;margin:0;">© ${new Date().getFullYear()} Kaaya Eco Resort</p>
        </td></tr>
      </table>
    </body>
    </html>
  `

  return transporter.sendMail({
    from:    FROM,
    to:      inquiry.email,
    subject: `We received your message – Kaaya Eco Resort`,
    html,
  })
}

// ── Admin notification for new inquiry ───────────────────────────────────────
export async function notifyAdminNewInquiry(inquiry) {
  if (!process.env.EMAIL_USER) return

  return transporter.sendMail({
    from:    FROM,
    to:      process.env.EMAIL_USER,
    subject: `New Inquiry: ${inquiry.subject} – from ${inquiry.name}`,
    text:    `New inquiry received:\n\nName: ${inquiry.name}\nEmail: ${inquiry.email}\nPhone: ${inquiry.phone || 'N/A'}\nSubject: ${inquiry.subject}\n\nMessage:\n${inquiry.message}`,
  })
}

export default { sendBookingConfirmation, sendInquiryAck, notifyAdminNewInquiry }
