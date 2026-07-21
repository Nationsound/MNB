const sendEmail = require("./sendEmail");


const sendPasswordChangedNotification = async(email)=>{

  await sendEmail(

    email,

    "MNB Password Changed Successfully",

    `
    Your My Nation Blog password has been changed successfully.

    If you did not perform this action, please contact support immediately.
    `,

    `
    <h2>Password Changed Successfully</h2>

    <p>
      Your My Nation Blog account password was updated.
    </p>

    <p>
      If this was not you, please contact support.
    </p>
    `

  );

};



const sendProfileUpdatedNotification = async(email)=>{

  await sendEmail(

    email,

    "MNB Profile Updated",

    `
    Your My Nation Blog profile has been updated successfully.
    `,

    `
    <h2>Profile Updated</h2>

    <p>
      Your MNB profile information has been updated.
    </p>
    `

  );

};


const sendAccountDeletedNotification = async(email)=>{

  await sendEmail(
    email,
    "MNB Account Deleted",
    "Your My Nation Blog account has been deleted successfully.",
    `
    <h2>Account Deleted</h2>
    <p>Your My Nation Blog account has been permanently removed.</p>
    `
  );

};

const sendTicketReadyNotification = async(
  email,
  event,
  ticketNumber
)=>{


await sendEmail(

email,

"Your MNB Event Ticket is Ready",

`
Your payment has been approved.

Event:
${event.title}

Ticket Number:
${ticketNumber}

You can now access your ticket from your MNB dashboard.
`,

`
<h2>Ticket Confirmed 🎟️</h2>

<p>
Your payment has been approved successfully.
</p>

<h3>${event.title}</h3>

<p>
Ticket Number:
<strong>${ticketNumber}</strong>
</p>

<p>
You can now view your ticket from your MNB dashboard.
</p>

`

);


};

module.exports = {

  sendPasswordChangedNotification,

  sendProfileUpdatedNotification,

  sendAccountDeletedNotification,

  sendTicketReadyNotification

};