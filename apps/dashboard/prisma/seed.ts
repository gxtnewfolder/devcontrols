import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client.js";

const prisma = new PrismaClient();

async function main() {
  // Environment
  const dev = await prisma.environment.upsert({
    where: { key: "dev" },
    update: {},
    create: { key: "dev", name: "Development" },
  });

  const stg = await prisma.environment.upsert({
    where: { key: "stg" },
    update: {},
    create: { key: "stg", name: "Staging" },
  });

  const prod = await prisma.environment.upsert({
    where: { key: "prod" },
    update: {},
    create: { key: "prod", name: "Production" },
  });

  // Projects
  const crm = await prisma.project.upsert({
    where: { key: "crm" },
    update: {},
    create: {
      key: "crm",
      name: "CRM System",
      type: "web-app",
      description: "Customer Relationship Management",
    },
  });

  const hrm = await prisma.project.upsert({
    where: { key: "hrm" },
    update: {},
    create: {
      key: "hrm",
      name: "HRM Platform",
      type: "web-app",
      description: "Human Resource Management",
    },
  });

  const mlPlatform = await prisma.project.upsert({
    where: { key: "ml-platform" },
    update: {},
    create: {
      key: "ml-platform",
      name: "ML Platform",
      type: "ml-platform",
      description: "Model training & serving",
    },
  });

  // Services
  const crmBackend = await prisma.service.upsert({
    where: { key: "crm-backend" },
    update: {},
    create: {
      key: "crm-backend",
      name: "CRM Backend API",
      projectId: crm.id,
      ciProvider: "github-actions",
    },
  });

  const crmFrontend = await prisma.service.upsert({
    where: { key: "crm-frontend" },
    update: {},
    create: {
      key: "crm-frontend",
      name: "CRM Frontend",
      projectId: crm.id,
      ciProvider: "github-actions",
    },
  });

  const hrmBackend = await prisma.service.upsert({
    where: { key: "hrm-backend" },
    update: {},
    create: {
      key: "hrm-backend",
      name: "HRM Backend API",
      projectId: hrm.id,
      ciProvider: "github-actions",
    },
  });

  const mlServing = await prisma.service.upsert({
    where: { key: "ml-serving" },
    update: {},
    create: {
      key: "ml-serving",
      name: "ML Serving API",
      projectId: mlPlatform.id,
      ciProvider: "github-actions",
    },
  });

  // Deployments ตัวอย่าง
  await prisma.deployment.createMany({
    data: [
      {
        serviceId: crmBackend.id,
        environmentId: dev.id,
        version: "abc1234",
        status: "success",
        triggeredBy: "seed",
      },
      {
        serviceId: crmBackend.id,
        environmentId: stg.id,
        version: "def5678",
        status: "success",
        triggeredBy: "seed",
      },
      {
        serviceId: crmFrontend.id,
        environmentId: dev.id,
        version: "xyz9999",
        status: "failed",
        triggeredBy: "seed",
      },
      {
        serviceId: hrmBackend.id,
        environmentId: dev.id,
        version: "qwe1111",
        status: "success",
        triggeredBy: "seed",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });