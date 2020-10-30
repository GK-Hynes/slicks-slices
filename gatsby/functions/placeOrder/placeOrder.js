const nodemailer = require("nodemailer");

function generateOrderEmail({ order, total }) {
  return `
      <div>
        <h2>Your Recent Order for ${total}</h2>
        <p>Please start walking over. We'll have your order ready in the next 20 minutes.</p>
        <ul>
          ${order
            .map(
              (item) => `<li>
            <img src="${item.thumbnail}" alt="${item.name}"/>
            ${item.size} ${item.name} - ${item.price}
          </li>`
            )
            .join("")}
        </ul>
        <p>Your total is <strong>$${total}</strong> due at pickup</p>
        <style>
            ul {
              list-style: none;
            }
        </style>
      </div>
    `;
}

// Create a transport for nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  }
});

exports.handler = async (event, context) => {
  const body = JSON.parse(event.body);

  // Check if honeypot filled out
  if (body.mapleSyrup) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Boop beep bop zzzzst goodbye ERR 34234"
      })
    };
  }

  // Validate that the data coming is in correct
  const requiredFields = ["email", "name", "order"];

  for (const field of requiredFields) {
    console.log(`Checking that ${field} is good`);
    if (!body[field]) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Oops! You are missing the ${field} field`
        })
      };
    }
  }

  // Make sure there actually are items in the order
  if (!body.order.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: `Why woud you order nothing?`
      })
    };
  }

  // Send the email
  const info = await transporter.sendMail({
    from: "Slick's Slices <slick@example.com>",
    to: `${body.name} <${body.email}>, orders@example.com`,
    subject: "New order!",
    html: generateOrderEmail({ order: body.order, total: body.total })
  });
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Success" })
  };
};
