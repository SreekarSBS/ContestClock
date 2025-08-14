// jobs/sendReminder.js
const { Resend } = require('resend');
const resend = new Resend(process.env.EMAIL_API_KEY);

const defineSendReminderJob = (agenda) => {
  agenda.define('send contest reminder', async job => {
    const { email, contestName, hoursBefore, contestUrl } = job.attrs.data;
    console.log(`🚀 Sending reminder to ${email} for ${contestName}`);
    try {
      await resend.emails.send({
        from: 'reminders@contestclock.live',
        to: email,
        subject: `⏰ ${contestName} starts in ${hoursBefore} hour(s)!`,
        html: `<div>
          <h1>Don't forget! ${contestName} starts in ${hoursBefore} hour(s).</h1>
          <h2><a href="${contestUrl}">${contestUrl}</a></h2>
        </div>`,
      });
    } catch (err) {
      console.error(`❌ Failed to send email to ${email}:`, err);
    }
  });
}
module.exports = defineSendReminderJob