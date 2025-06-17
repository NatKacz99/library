import React from 'react';
import './Contact.css';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

function Contact() {
  return (
    <div class="contact">
      <p><LocationPinIcon /><strong>Address</strong>: Blue 23 Blue Street, London, SW1A 2AA, Great Britain</p>
      <p><PhoneIcon /><strong>Telephone</strong>: 123456</p>
      <p><EmailIcon /><strong>Email</strong>: lightfeather@gmail.com</p>
    </div>)
}

export default Contact;