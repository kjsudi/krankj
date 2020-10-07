import React from "react";
import styles from "./Contact.module.css";
import { useFormik } from "formik";
import axios from "axios";
import { API_ENDPOINT } from "../../../constants";

const Contact = () => {
  const postData = (values) => {
    axios
      .post(`${API_ENDPOINT}/api/contact/submit`, values)
      .then((res) => console.log(res.data.msg))
      .catch((err) =>
        console.log("Error occurred while submittin the form data", err)
      );
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
    },
    onSubmit: (values, { resetForm }) => {
      postData(values);
      resetForm({ values: "" });
    },
  });

  return (
    <div className={styles.mainContainer}>
      <form onSubmit={formik.handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
        />
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default Contact;
