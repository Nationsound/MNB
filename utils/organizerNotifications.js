const sendEmail = require("./sendEmail");


// Application submitted

const sendOrganizerApplicationNotification = async(email)=>{

await sendEmail(

email,

"Organizer Application Submitted",

"Your organizer application has been received.",

`
<h2>My Nation Blog Events</h2>

<p>
Your organizer application has been successfully submitted.
</p>

<p>
Our team will review your application and notify you once approved.
</p>

`

);

};




// Profile updated

const sendOrganizerProfileUpdateNotification = async(email)=>{


await sendEmail(

email,

"Organizer Profile Updated",

"Your organizer profile has been updated successfully.",


`
<h2>Profile Updated</h2>

<p>
Your organizer information was successfully updated.
</p>

`

);


};




// Password changed

const sendOrganizerPasswordChangedNotification = async(email)=>{


await sendEmail(

email,

"Organizer Password Changed",

"Your password was changed successfully.",


`
<h2>Password Changed</h2>

<p>
Your organizer account password has been updated.
</p>

<p>
If this was not you, contact support immediately.
</p>

`

);


};




// Account deleted

const sendOrganizerDeleteNotification = async(email)=>{


await sendEmail(

email,

"Organizer Account Deleted",

"Your organizer account has been deleted.",


`
<h2>Account Deleted</h2>

<p>
Your organizer account has been permanently removed.
</p>

`

);


};

const sendEventApprovedNotification = async(
 email,
 eventTitle
)=>{

await sendEmail(
email,
"Event Approved - My Nation Blog",
`Your event ${eventTitle} has been approved.`,
`
<h2>Event Approved 🎉</h2>

<p>
Your event
<strong>${eventTitle}</strong>
has been approved.
</p>

<p>
Users can now book tickets.
</p>
`
);

};




// Event rejected

const sendEventRejectedNotification = async(
email,
eventTitle
)=>{


await sendEmail(

email,

"Event Rejected - My Nation Blog",

`Your event ${eventTitle} was rejected.`,

`
<h2>Event Rejected</h2>

<p>
Your event
<strong>${eventTitle}</strong>
requires attention.
</p>
`

);


};




// New booking

const sendNewBookingNotification = async(
email,
eventTitle,
amount
)=>{


await sendEmail(

email,

"New Event Booking",

`New booking received for ${eventTitle}`,

`
<h2>New Booking 🎟️</h2>

<p>
Event:
<strong>${eventTitle}</strong>
</p>

<p>
Amount:
<strong>₦${amount}</strong>
</p>

`

);


};


module.exports={

sendOrganizerApplicationNotification,

sendOrganizerProfileUpdateNotification,

sendOrganizerPasswordChangedNotification,

sendOrganizerDeleteNotification,

sendEventApprovedNotification,

sendEventRejectedNotification,

sendNewBookingNotification

};