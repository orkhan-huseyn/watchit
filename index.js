#!/usr/bin/env node
import fs from "fs";
import { spawn } from "child_process";
import chokidar from "chokidar";
import debounce from "lodash.debounce";
import program from "caporal";

program
  .version("0.0.1")
  .argument("[filename]", "Name of a file to execute")
  .action(async function (args) {
    const { filename = "index.js" } = args;

    await fs.promises.access(filename);

    const restart = debounce(function () {
      spawn("node", [filename], { stdio: "inherit" });
    }, 100);

    chokidar
      .watch(".")
      .on("add", restart)
      .on("change", restart)
      .on("unlink", restart);
  });

program.parse(process.argv);
