import React from "react";
import styles from "./LandingPage.module.css";

const LandingPage = ({ children }) => {
  return (
    <div className={styles.mainContainer}>
      {children}
      <div className={styles.contentContainer}>
        <h1>Hello there 👋🏼</h1>
        <p>I'm Sudarshan KJ and I am a web developer</p>
        <p>9686678568</p>
      </div>
    </div>
  );
};

export default LandingPage;
