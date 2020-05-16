const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../server");
const should = chai.should();
chai.use(chaiHttp);

describe("/GET ALL MOVIES", () => {
  it("it should GET all the movies", done => {
    chai
      .request("http://localhost:3000")
      .get("/movies")
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
        done();
      });
  });
});

describe("/POST MOVIE", function () {
  let movie = {
    title: "Star Wars: The Force Awakens",
    director: "J. J. Abrams",
    description:
      "Thirty years after the Galactic Civil War,+the First Order has risen from the fallen Galactic Empire",
    duration: 120,
    images: {
      poster: "Star_Wars_The_Force_Awakens_Theatrical_Poster.jpg"
    },
    genre: "Scifi"
  };
  it("Should add the items to the database", done => {
    chai
      .request("http://localhost:3000")
      .post("/movies")
      .send(movie)
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a("object");
      });
    done();
  });
});
