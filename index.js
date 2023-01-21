const fs = require("fs");
const inquirer = require("inquirer");

const tableOfContents = `# **Table of Contents**
  1. [Description](#description)
  2. [Technology](#technology)
  3. [Features](#features)
  4. [Installation](#installation)
  5. [Usage](#usage)
  6. [About](#about)
  7. [Credits](#credits)
  8. [License](#license)`;

function deployed() {
  inquirer
    .prompt([
      {
        name: "link",
        message: "Deployed Link:",
      },
    ])
    .then((response) => {
      return response.link;
    });
}
async function description() {
  const userInput = new Array();
  await inquirer
    .prompt([
      {
        name: "desc",
        message: "Description:",
      },
      {
        name: "img",
        message:
          "Complement the Description with an image (use relative a file path): ./",
      },
    ])
    .then(async (response) => {
      await ammendRepeat("Description", description);
      userInput.push(response);
      // console.log(response.desc);
    });
  console.log(userInput);
}
async function technology() {
  const techArr = new Array();
  await inquirer
    .prompt([
      {
        type: "checkbox",
        name: "tech",
        message: "Technologies Used:",
        choices: [
          "git",
          "HTML",
          "CSS",
          "JavaScript",
          "Node.js",
          new inquirer.Separator(),
          "Other",
        ],
      },
    ])
    .then(async (response) => {
      techArr.push(...response.tech.filter((el) => el !== "Other"));

      // console.log(response)
      const moreTech = response.tech.filter((el) => el === "Other");
      // console.log("moreTech: ", moreTech)
      if (moreTech[0]) {
        //  console.log(moreTech);
        techArr.push(...(await ammendInput("Technology")));
      }
    });
  console.log(techArr);
}
async function features() {
  const userInput = new Array();

  await inquirer
    .prompt([
      {
        name: "code",
        message: "Code Highlight:",
      },
      {
        name: "desc",
        message: "Code Highlight Description:",
      },
    ])
    .then(async (response) => {
      userInput.push(response);
      // console.log("user input before: ", userInput);

      await ammendRepeat("Highlight", features);

      // console.log("user input after: ", userInput);
    });
  console.log(userInput);
}
async function installation() {
  const userInput = new Array();
  await inquirer
    .prompt([
      {
        type: "input",
        name: `step`,
        message: `Installation Instructions:`,
      },
    ])
    .then(async (response) => {
      // console.log(stepNum);
      await ammendRepeat("Step", installation);
      userInput.push(response.trim());
    });

  console.log(userInput);
}
async function usage() {
  const userInput = new Array();
  await inquirer
    .prompt([
      {
        type: "input",
        name: `step`,
        message: `Usage Instructions:`,
      },
    ])
    .then(async (response) => {
      // console.log(stepNum);
      await ammendRepeat("Step", usage);
      userInput.push(response.trim());
    });

  console.log(userInput);
}
function about() {
  inquirer
    .prompt([
      {
        name: "creator",
        message: "Your Name:",
      },
      {
        name: "eMail",
        message: "E-Mail Address:",
      },
      { name: "linkedIn", message: "Linked-In URL:" },
      {
        name: "gitHub",
        message: "Github URL:",
      },
    ])
    .then(async (response) => {
      console.log(response);
    });
}
function credits() {
  inquirer
    .prompt([
      {
        name: "credits",
        message: "Credits:",
      },
    ])
    .then((response) => {
      console.log(response.desc);
    });
}
function license() {
  inquirer
    .prompt([
      {
        name: "license",
        message: "Liscense:",
        choices: ["MIT", "ISC", "GPL", "Apache License 2.0", "BSD"],
      },
    ])
    .then((response) => {
      console.log(response);
    });
}
async function ammendRepeat(ammendType, fn) {
  await inquirer
    .prompt([
      {
        type: "confirm",
        name: "selection",
        message: `Add Another ${ammendType}?:`,
      },
    ])
    .then(async function (response) {
      response.selection && (await fn());
    });
}
async function ammendInput(ammendType) {
  const processedArr = new Array();
  await inquirer
    .prompt([
      {
        type: "input",
        name: `${ammendType}`,
        message: `Enter the ${ammendType} to Add (separate with commas):`,
      },
    ])
    .then(async (response) => {
      const responseArr = response[ammendType].split(",");

      const trimmedArr = responseArr.map((el) => el.trim());
      trimmedArr.forEach((el) => {
        el && processedArr.push(el);
      });
    });
  return processedArr;
}
