import request from "supertest";
// import { describe, it,  } from "@jest/globals";
import app from "../server.js";

describe("Search API", () => {

  it("should return all companies", async () => {
    const res = await request(app).get("/search");


    expect(res.status).toBe(200);
    
  });

  it("should filter by query", async () => {
    const res = await request(app).get("/api/search?query=solar");

    expect(res.status).toBe(200);
  });

  it("should filter by location", async () => {
    const res = await request(app).get("/api/search?location=Lagos");

    expect(res.status).toBe(200);
  });

  it("should filter by rating", async () => {
    const res = await request(app).get("/api/search?minRating=4");

    expect(res.status).toBe(200);
  });

  it("should paginate results", async () => {
    const res = await request(app).get("/api/search?page=2&limit=5");

    expect(res.status).toBe(200);
  });
});


