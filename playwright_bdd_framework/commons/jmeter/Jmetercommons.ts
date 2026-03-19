export class JmeterCommons {

   // Common method to execute command line and expect promise in return
   private static executeCLICommand(command: string): Promise<string> {
      const { exec } = require('child_process');

      return new Promise((resolve, reject) => {

         exec(command, (error: Error, stdout: string, stderr: string) => { // executing the command and handlig the csll back
            if (error) { // if error occurs, log the error and reject the promise(fail the test)
               reject(error);
               return;
            }
            resolve("Command line Executed Successfully"); // if command execute successfully, resolve the promise(pass the test)

         });
      });

   }

   static async runJmeterTestPlan(jmxFile: string): Promise<void> {


      //Update relative path from project folder to get the Jmeter utilities
      const projectRoot = process.cwd();
      const jmeterBasePath = `${projectRoot}/tests/performance/jmeter`;
      const jmeterBinPath = `${jmeterBasePath}/bin`;
      const testPlanPath = `${jmeterBasePath}/testplans/${jmxFile}`;
      const resultsPath = `${jmeterBasePath}/results/TestResults.csv`;
      const reportPath = `${jmeterBasePath}/report-output`;


      //Delete the prevoius results and report if they exist
      const fs = require('fs');
      if (fs.existsSync(resultsPath)) { //if results file exists, delete it
         fs.unlinkSync(resultsPath); //delete it
      }
      if (fs.existsSync(reportPath)) {
         fs.rmSync(reportPath, { recursive: true, force: true }); // delete it and its contents
      }

      //Run Jmeter test Plan using command line and generate CSV results
      const commandToRunJmxFile = `"${jmeterBinPath}" -n -t "${testPlanPath}" -l "${resultsPath}"`;
      const result = await this.executeCLICommand(commandToRunJmxFile);
      console.log(result); //log the result of command execution

      //Generate the JMeter report from CSV results using commond line
      const commandToGenerateReport = `"${jmeterBinPath}" -g "${resultsPath}" -o "${reportPath}"`;
      const report = await this.executeCLICommand(commandToGenerateReport); //execute the command to generate report  
      console.log(report); //log the result of command line execution
   }

}