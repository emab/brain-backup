# TypesScript Strict Check Staged

This script is intended to be used along with an array of changed files. It will run strict TS checks but only
show errors relating to files you have provided, not the whole project. This can be useful when you are converting
a non strict codebase to strict incrementally.

```js
#!/usr/bin/env node

/* eslint-disable no-console */
const { execSync, spawnSync } = require("child_process");
const { writeFileSync } = require("fs");

const TEMP_FILE_NAME = ".tsconfig-lint.json";

const colour = {
    red: (input) => `\x1b[91m${input}\x1b[0m`,
    underline: (input) => `\x1b[4m${input}\x1b[0m`,
    subtle: (input) => `\x1b[2m${input}\x1b[0m`,
};

function checkTypescriptStrict() {
    const STAGED_FILES = process.argv.slice(2);
    const joinedFiles = STAGED_FILES.map((path) => `\"${path}\"`).join(",");

    // We only want staged files "included" in our temporary tsconfig
    // Also include all our custom type definition files
    const tempTsConfig = `{ "extends": "./tsconfig.json", "include": [${joinedFiles}, "**/*.d.ts"] }`;
    writeFileSync(TEMP_FILE_NAME, tempTsConfig);

    const tscResult = spawnSync("npx tsc --project .tsconfig-lint.json --noEmit --skipLibCheck", {
        shell: true,
    });

    /*
     * Split stdout by each line
     *
     * Input:
     * src/example/FormValidators.ts(63,36): error TS2571: Object is of type 'unknown'.
     * src/example/FormValidators.ts(65,7): error TS2322: Type '(value: string, message: string) => string | undefined' is not assignable to type 'ValidatorFn'.
     *   Types of parameters 'value' and 'value' are incompatible.
     *     Type 'unknown' is not assignable to type 'string'.
     *
     * Regex: Split on new line
     *
     * Output:
     * [
     *  "src/example/FormValidators.ts(63,36): error TS2571: Object is of type 'unknown'.",
     *  "src/example/FormValidators.ts(65,7): error TS2322: Type '(value: string, message: string) => string | undefined' is not assignable to type 'ValidatorFn'.",
     *   "  Types of parameters 'value' and 'value' are incompatible.",
     *   "    Type 'unknown' is not assignable to type 'string'."
     * ]
     */
    const allErrors = tscResult.stdout.toString("utf-8").split(/\n/g);

    const stagedFileErrors = [];

    for (let i = 0; i < allErrors.length; ) {
        const error = allErrors[i];
        if (STAGED_FILES.some((filePath) => error.includes(filePath))) {
            // The filename is included in staged files
            stagedFileErrors.push(error);
            /*
             * Keep matching lines if they start with any whitespace
             * Any indented lines are describing the error before so are all relevant
             *
             * Regex: Match any line that begins with 1 or more whitespace character
             */
            while (++i < allErrors.length && allErrors[i].match(/^\s+/)) {
                stagedFileErrors.push(allErrors[i]);
            }
        } else {
            /* The filename is not included in staged files
             * Any indented files are details for this error, so skip them too
             *
             * Regex: Match any line that begins with 1 or more whitespace character
             */
            // eslint-disable-next-line no-empty
            while (++i < allErrors.length && allErrors[i].match(/^\s+/)) {}
        }
    }

    const errorMap = {};

    // Group errors from same files together
    for (let i = 0; i < stagedFileErrors.length; ) {
        const input = stagedFileErrors[i];
        /*
         * Split the error line into file name and line number, preserving the error
         *
         * Input: "src/example/FormValidators.ts(63,36): error TS2571: Object is of type 'unknown'."
         *
         * Regex: Split the string using ":".
         *        The grouped parameter (everything after ":") is spliced into the result array.
         *
         * Output: ["src/example/FormValidators.ts(63,36)", "  error TS2571: Object is of type 'unknown'."]
         */
        const [fileAndLine, error] = input.split(/:(.+)/);
        const details = [];

        /*
         * Split the filename and line number
         *
         * Input: "src/example/FormValidators.ts(63,36)"
         *
         * Regex: Split the string by matching the line number and position.
         *        Since they are grouped, they also are spliced into the matching array.
         *
         * Output: ["src/example/FormValidators.ts", "(63,36)"]
         */
        const [fileName, lineNumber] = fileAndLine.split(/(\(\d+,\d+\))/g);

        // Format line number to mirror eslint output
        const formattedLineNumber = lineNumber
            .replace(/[()]/g, "")
            .replace(/,/g, ":")
            .padStart(9, " ");

        /*
         * Push any indented lines into the details array.
         * All indented lines are relevant to the base error.
         *
         * Regex: Match any line that begins with 1 or more whitespace character
         */
        while (++i < stagedFileErrors.length && stagedFileErrors[i].match(/^\s+/)) {
            details.push(stagedFileErrors[i]);
        }

        // Isolate TS error code and the error
        const [tsCodeAndType, errorText] = error.split(/:(.+)/);
        // Isolate TS code and error type (always error)
        const [type, tsCode] = tsCodeAndType.trim().split(" ");

        const logLine = [
            colour.subtle(formattedLineNumber),
            colour.red(type),
            errorText.trim(),
            colour.subtle(tsCode),
        ].join(" ");

        errorMap[fileName] = [
            ...(errorMap?.[fileName] ? errorMap[fileName] : []),
            logLine,
            ...details.map((detail) => `\t\t${detail}`),
        ];
    }

    Object.entries(errorMap).forEach(([fileName, errors]) => {
        const numErrorsInFile = errors.filter((err) => !err.match(/^\s/)).length;
        console.error(
            `${colour.underline(fileName)} ${colour.subtle(`${numErrorsInFile} error(s)`)}`
        );
        console.log(errors.join("\n"));
        console.log("\n");
    });

    execSync(`rm ${TEMP_FILE_NAME}`);

    if (stagedFileErrors.length) {
        process.exit(1);
    }

    process.exit(0);
}

checkTypescriptStrict();
```