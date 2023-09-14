import nodemailer from "nodemailer";
import * as dotenv from 'dotenv';

dotenv.config()

export const sendMail = async (req,res)=>{
    const {name,email,user,detailUrl,message} = req.body;

    const emailHTML = `
        <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f5f5f5;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 10px;
                }
                .header {
                    background-color: #f48840;
                    color: #ffffff;
                    text-align: center;
                    padding: 20px;
                    border-radius: 10px 10px 0 0;
                }
                .content {
                    padding: 20px;
                }
                .button {
                    display: inline-block;
                    padding: 10px 20px;
                    background-color: #f48840;
                    color: #ffffff;
                    text-decoration: none;
                    border-radius: 5px;
                    margin-top: 20px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Request for Animal Adoption</h1>
                </div>
                <div class="content">
                    <p>Dear ${name},</p>
                    <p>I am interested in adopting one of your pets. Please find my contact information below:</p>
                    <p><strong>Name:</strong> ${user.name}</p>
                    <p><strong>Contact No:</strong> ${user.contactNo}</p>
                    <p><strong>Email:</strong> ${user.email}</p>
                    <p><strong>Address:</strong> ${user.address} ${user.city} ${user.country}</p>
                    <p><strong>Message:</strong> ${message}</p>
                    <p>You can view the details of the pet by clicking the link below:</p>
                    <a class="button" href="${detailUrl}" target="_blank">View Pet Details</a>
                </div>
            </div>
        </body>
        </html>`;


    let mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'straytostayhelp@gmail.com',
            pass: 'jdcfmsicmdrrccuk'
        }
    });
     
    let mailDetails = {
        from: 'straytostayhelp@gmail.com',
        to: email,
        subject: 'Request for Animal Adoption',
        html: emailHTML
    };
     
    mailTransporter.sendMail(mailDetails, function(err, data) {
        if(err) {
            res.status(500).send(err);
        } else {
            res.status(200).send('Email sent successfully');
        }
    });
}