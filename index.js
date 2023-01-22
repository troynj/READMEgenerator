const fs = require("fs");
const inquirer = require("inquirer");

function startWriting(data) {
  fs.writeFile("gREADME.md", `${data}`, (err) => err && console.error(err));
}
async function appendTemplate(data, templateType) {
  // console.log("9", data);
  var printer = await templateType(data);
  // console.log("printer: ", printer)
  fs.appendFileSync("gREADME.md", `${printer}`, (err) => err && console.error(err));
}

async function appendTitle(titleType) {
  fs.appendFile("gREADME.md", `${titleType()}`, (err) =>
  err && console.error(err)
  );
}

async function deployedTemplate(link) {
  return `[Deployed site](${link})\n\n`;
}

function descriptionTitle() {
  return `# **Description**\n\n`;
}
function descriptionTemplate({ desc, path }) {
  return `${desc}\n![Screenshot](./${path})\n\n`;
}

function technologyTitle() {
  return `# **Technology**\n\n`;
  // | Technology Used | Resource URL |
  //   | ------------- |:-------------|\n;
}
function technologyTemplate(tech) {
  const techIndex = {
    GIT: "https://git-scm.com/",
    HTML: "https://developer.mozilla.org/en-US/docs/Web/HTML",
    CSS: "https://developer.mozilla.org/en-US/docs/Web/CSS",
    JavaScript: "https://developer.mozilla.org/en-US/docs/Learn/JavaScript",
    jQuery: "https://api.jquery.com/",
    "Web APIs": "https://developer.mozilla.org/en-US/docs/Web/API",
  };
  console.log("in", tech, techIndex[tech])

  if (techIndex[tech]) {
    return `| ${tech} | [${techIndex[tech]}](${techIndex[tech]}) |\n`;
  } else {
    return `| ${tech} | [${tech}](${tech}) |\n`;
  }
}

function featuresTitle() {
  return `# **Features**\n\n`;
}

async function featuresTemplate({ code, desc }) {
  return `${desc}\n\`\`\`\n${code}\n\`\`\`\n`;
}

function installationTitle() {
  return `# **Installation**\n\n`;
}

async function installationTemplate({ step, path }) {
  return `${step}\n![Screenshot](./${path})\n\n`;
}
function usageTitle() {
  return `# **Usage**\n\n`;
}
async function usageTemplate({ step, path }) {
  return `${step}\n![Screenshot](./${path})\n\n`;
}
function aboutTitle() {
  return `# **About**\n\n`;
}
async function aboutTemplate({ creator, eMail, linkedIn, gitHub }) {
  return `${creator}\n\n![Email](${eMail}})\n[Linked In](${linkedIn}})\n[GitHub](${gitHub}})\n\n`;
}
function creditsTitle() {
  return `# **Credits**\n\n`;
}
async function creditsTemplate({ credits }) {
  return `credits: ${credits}`;
}
function licenseTitle() {
  return `# **License**\n\n`;
}
async function licenseTemplate({ license }) {
  return `adding a ${license} license`;
}
const tableOfContents = `# **Table of Contents**
  1. [Description](#description)
  2. [Technology](#technology)
  3. [Features](#features)
  4. [Installation](#installation)
  5. [Usage](#usage)
  6. [About](#about)
  7. [Credits](#credits)
  8. [License](#license)\n\n`;

async function deployed() {
  await inquirer
    .prompt([
      {
        name: "link",
        message: "Deployed Link:",
      },
    ])
    .then(async (response) => {
      appendTemplate(response.link, deployedTemplate);
    });
}
async function description() {
  await inquirer
    .prompt([
      {
        name: "desc",
        message: "Description of Application:",
      },
      {
        name: "path",
        message:
          "Complement the Description with an Image (use relative a file path): ./",
      },
    ])
    .then(async (response) => {
      response.desc = response.desc.trim();
      response.path = response.path.trim();
      await appendTemplate(response, descriptionTemplate);
      await ammendRepeat("Description", description);
    });
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
          "GIT",
          "HTML",
          "CSS",
          "JavaScript",
          "jQuery",
          "Node.js",
          "Web APIs",
          "AJAX",
          "AXIOS",
          new inquirer.Separator(),
          "Other",
        ],
      },
    ])
    .then(async (response) => {
      techArr.push(...response.tech.filter((el) => el !== "Other"));
      const moreTech = response.tech.filter((el) => el === "Other");
      moreTech[0] && techArr.push(...(await ammendInput("Technology")));
      
      console.log("ta b4 loop",techArr)
      // console.log("inside: ", techArr)
      techArr.forEach(async (el) => await appendTemplate(el, technologyTemplate));
    });
}
async function features() {
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
      appendTemplate(response, featuresTemplate);
      await ammendRepeat("Highlight", features);
    });
}
async function installation() {
  await inquirer
    .prompt([
      {
        type: "input",
        name: `step`,
        message: `Installation Instructions:`,
      },
      {
        name: "path",
        message: "Include an image of this step (use relative file path) ./",
      },
    ])
    .then(async (response) => {
      response.desc = response.step.trim();
      response.path = response.path.trim();
      appendTemplate(response, descriptionTemplate);
      ammendRepeat("Description", description);
    });

  console.log(userInput);
}
async function usage() {
  inquirer
    .prompt([
      {
        type: "input",
        name: `step`,
        message: `Usage Instructions:`,
      },
      {
        name: "path",
        message: "Include an image of this step (use relative file path) ./",
      },
    ])
    .then(async (response) => {
      response.step = response.step.trim();
      response.path = response.path.trim();
      appendTemplate(response, usageTemplate);
      ammendRepeat("Step", usage);
    });

  console.log(userInput);
}
async function about() {
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
      appendTemplate(response, aboutTemplate);
      ammendRepeat("Author", about);
    });
}
async function credits() {
  inquirer
    .prompt([
      {
        name: "credits",
        message: "Credits:",
      },
    ])
    .then((response) => {
      appendTemplate(response, creditsTemplate);
      ammendRepeat("Credit", credits);
    });
}
async function license() {
  const licenseArr = new Array();
  inquirer
    .prompt([
      {
        type: "checkbox",
        name: "license",
        message: "Liscense:",
        choices: [
          "MIT",
          "ISC",
          "GPL",
          "Apache License 2.0",
          "BSD",
          new inquirer.Separator(),
          "Other",
        ],
      },
    ])
    .then(async (response) => {
      licenseArr.unshift(...response.license.filter((el) => el !== "Other"));

      // console.log(response)
      const moreTech = response.license.filter((el) => el === "Other");
      // console.log("moreTech: ", moreTech)
      if (moreTech[0]) {
        //  console.log(moreTech);
        licenseArr.unshift(...(await ammendInput("License")));
      }
      // console.log("inside: ", techArr)
      licenseArr.forEach((el) => appendTemplate(el, licenseTemplate));
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

async function init() {
  startWriting(tableOfContents);
  await deployed();
  await appendTitle(descriptionTitle);
  await description();
  await appendTitle(technologyTitle);
  await technology();
  await appendTitle(featuresTitle);
  await features();
  await appendTitle(installationTitle);
  await installation();
  await appendTitle(usageTitle);
  await usage();
  await appendTitle(aboutTitle);
  await about();
  await appendTitle(creditsTitle);
  await credits();
  await appendTitle(licenseTitle);
  await license();
}

init();
