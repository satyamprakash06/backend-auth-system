import nodemailer from "nodemailer"

const transporter =  nodemailer.createTransport({
    host: "smtp.exmple.com",
    port: 587,
    secure: false,

    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
})

const sendMail = async (to, subject, html)=>{
    await transporter.sendMail({
        from: `${process.env.SMTP_FROM_EMAIL}`,
        to,
        subject,
        html,
    })
}

const sendVerificationEmail = async (email, token)=>{
    const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`
    await transporter.sendMail({
       from: `${process.env.SMTP_FROM_EMAIL}`,
       to: email,                     // fixed "email" → "to: email"
       subject: "Verify your email address",  //  defined subject
       html:                         
            `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #4F46E5;">Verify your email</h2>
                <p>Thanks for signing up! Please verify your email:</p>
                <a href="${verifyUrl}"
                   style="display:inline-block; background:#4F46E5;
                          color:white; padding:12px 24px; border-radius:6px;
                          text-decoration:none; margin:16px 0;">
                    Verify Email
                </a>
                <p>⏰ This link expires in <strong>15 minutes</strong>.</p>
                <p style="color:#888; font-size:13px;">
                    If you didn't create an account, ignore this email.
                </p>
                </div>
                 `,       
    })
}

export{sendMail, sendVerificationEmail}