process.env.NODE_ENV = "test";

//Http assertions comes from supertest
const request = require("supertest");

const app = require("../../../app");
const conn = require("../../../db/index.js");
const Post = require("../../../db/models/post");
//mocha is for basic describe and it functions
const mocha = require("mocha");
const { assert, expect } = require("chai");

mocha.describe("/Posts Route Tests", () => {
  before(done => {
    conn
      .connect()
      .then(() => done())
      .catch(err => done(err));
  });

  after(done => {
    conn
      .close()
      .then(() => done())
      .catch(err => done(err));
  });

  it("Get all Posts", done => {
    request(app)
      .get("/posts")
      .expect("Content-Type", "application/json")
      .expect(200)
      .then(res => {
        // console.log(res.body);
        const body = res.body;
        assert(body instanceof Array, true);
        done();
      })
      .catch(err => done(err));
  }).timeout(10000);

  it("Get Post by ID", done => {
    request(app)
      .post("/posts")
      .send({
        title: "Post 1",
        message: "Lorem ipsum",
      })
      .then(res =>
        request(app)
          .get("/posts/" + res.body._id.valueOf())
          .expect("Content-Type", "application/json")
          .expect(200)
          .then(getRes => {
            // console.log(res.body);
            const body = getRes.body;
            // console.log(body);
            expect(body).to.contain.property("_id");
            expect(body._id, res.body._id);
            expect(body).to.contain.property("title");
            expect(body.title, res.body.title);
            expect(body).to.contain.property("message");
            expect(body.message, res.body.message);
            done();
          })
          .catch(err => done(err))
      )
      .catch(err => done(err));
  }).timeout(10000);

  it("Patch Post by ID", done => {
    const patchReq = {
      title: "Post 1 changed",
      message: "Lorem ipsum changed",
    };

    request(app)
      .post("/posts")
      .send({
        title: "Post 1",
        message: "Lorem ipsum",
      })
      .then(res =>
        request(app)
          .patch("/posts/" + res.body._id.valueOf())
          .send(patchReq)
          .expect("Content-Type", "application/json")
          .expect(200)
          .then(postRes => {
            request(app)
              .get("/posts/" + res.body._id.valueOf())
              .expect("Content-Type", "application/json")
              .expect(200)
              .then(getRes => {
                const body = getRes.body;
                // console.log(body);
                expect(body).to.contain.property("_id");
                expect(body._id, res.body._id);
                expect(body).to.contain.property("title");
                expect(body.title, patchReq.title);
                expect(body).to.contain.property("message");
                expect(body.message, patchReq.message);
                done();
              })
              .catch(err => done(err));
          })
          .catch(err => done(err))
      )
      .catch(err => done(err));
  }).timeout(10000);

  it("Delete Post by ID", done => {
    const patchReq = {
      title: "Post 1 changed",
      message: "Lorem ipsum changed",
    };

    request(app)
      .post("/posts")
      .send({
        title: "Post 1",
        message: "Lorem ipsum",
      })
      .then(res =>
        request(app)
          .delete("/posts/" + res.body._id.valueOf())
          .expect("Content-Type", "application/json")
          .expect(200)
          .then(postRes => {
            const body = postRes.body;
            expect(body).to.contain.property("_id");
            expect(body._id, res.body._id);
            done();
          })
          .catch(err => done(err))
      )
      .catch(err => done(err));
  }).timeout(10000);
});
