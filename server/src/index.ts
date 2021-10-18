import * as http from "http";
import * as path from "path";

import Express from "express";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import { Server } from "socket.io";

import * as patientController from "./controllers/patientController";
import * as queueController from "./controllers/queueController";
import * as doctorController from "./controllers/doctorController";
import { setIo } from "./io";

const app = Express();
const server = http.createServer(app);
setIo(new Server(server));

app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(helmet());
app.use(cors());
app.use(Express.static(path.join(__dirname, "../build")));

app.post("/patients/create", patientController.create);

app.get("/queues/gettickets", queueController.getTickets);
app.get("/queues/getactivequeue", queueController.getActiveQueue);
app.get("/queues/getticketswithdoctors", queueController.getTicketsWithDoctors);
app.post("/queues/opennewqueue", queueController.openNewQueue);
app.post("/queues/closeactivequeue", queueController.closeActiveQueue);

app.post("/doctors/adddoctor", doctorController.addDoctor);
app.get("/doctors/getalldoctors", doctorController.getAllDoctors);
app.post("/doctors/toggleduty", doctorController.toggleDuty);
app.get("/doctors/getondutydoctors", doctorController.getOnDutyDoctors);
app.post("/doctors/nextpatient", doctorController.nextPatient);
app.put("/doctors/:doctorId", doctorController.updateDoctor);
app.delete("/doctors/:doctorId", doctorController.deleteDoctor);

// Handle React routing, return all requests to React app
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

// start the server
const PORT = process.env.PORT || 1604;

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
