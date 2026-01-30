import express from "express";
import { db } from "./src/db/index.js";
import { leaveRequests, notifications } from "./src/db/schema.js";
import { eq } from "drizzle-orm";
import cors from "cors";




const app = express();
app.use(cors());

app.use(express.json());

// 1. Student submits leave
app.post("/api/leave/requests", async (req, res) => {
  try {
    await db.insert(leaveRequests).values(req.body);
    res.json({ message: "Leave request submitted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to submit leave" });
  }
});


// 2. Teacher views all requests
app.get("/api/leave/requests", async (req, res) => {
  try {
    const { teacherId } = req.query;

    let data;
    if (teacherId) {
      data = await db.select().from(leaveRequests)
        .where(eq(leaveRequests.teacherId, teacherId));
    } else {
      data = await db.select().from(leaveRequests);
    }

    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch requests" });
  }
});


// 3. Get single leave request
app.get("/api/leave/requests/:id", async (req, res) => {
  try {
    const data = await db.select().from(leaveRequests)
      .where(eq(leaveRequests.id, Number(req.params.id)));

    res.json(data[0]);
  } catch {
    res.status(500).json({ error: "Failed to fetch leave" });
  }
});


// 4. Teacher approves / rejects leave
app.post("/api/leave/requests/:id/process", async (req, res) => {
  const { action, teacherId, comment } = req.body;
  const leaveId = Number(req.params.id);

  try {
    await db.transaction(async (tx) => {

      await tx.update(leaveRequests)
        .set({
          status: action,
          teacherComment: comment,
          processedAt: new Date(),
          processedBy: teacherId
        })
        .where(eq(leaveRequests.id, leaveId));

      const leave = await tx.select().from(leaveRequests)
        .where(eq(leaveRequests.id, leaveId));

      await tx.insert(notifications).values({
        studentId: leave[0].studentId,
        leaveId,
        title: `Leave ${action}`,
        message: `Your leave request was ${action} by teacher`
      });
    });

    res.json({ message: `Leave ${action} successfully` });
  } catch {
    res.status(500).json({ error: "Processing failed" });
  }
});


// 5. Student views notifications
app.get("/api/leave/student/:id/notifications", async (req, res) => {
  try {
    const data = await db.select().from(notifications)
      .where(eq(notifications.studentId, req.params.id));

    res.json(data);
  } catch {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});


// ===== MANUAL ADD NOTIFICATION (TESTING PURPOSE) =====
app.post("/api/leave/notifications", async (req, res) => {
  try {
    await db.insert(notifications).values(req.body);
    res.json({ message: "Notification added successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to add notification" });
  }
});


// Server
app.listen(3000, () => {
  console.log("Leave Management API running on http://localhost:3000");
});
