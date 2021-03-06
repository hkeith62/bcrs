/*
=======================================
// Title: Bob’s Computer Repair Shop
// Date: 27 April 2022
// Authors: Evan Durkin, Keith Hall,
// Gustavo Roo Gonzalez, and Gunner Bradley
// Description: CRUD APIs for users.
=======================================
*/

// Require Statements
const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const BaseResponse = require("../services/base-response");
const ErrorResponse = require("../services/error-response");
const Role = require("../models/role");

const router = express.Router();
const saltRounds = 10; //used for hashing password

// findAllUsers API
router.get("/", async (req, res) => {
  try {
    //Finds and returns all users as an array
    User.find({})
      .where("isDisabled")
      .equals(false)
      .exec(function (error, users) {
        // Error handling
        if (error) {
          console.log(error);
          const serverError = new ErrorResponse(
            "500",
            "Internal server error",
            error
          ); // Create a variable and instantiate the errorResponse class.
          res.status(500).send(serverError.toObject());
        } else {
          // Return all users
          console.log(users);
          const queryResponse = new BaseResponse(
            "200",
            "Query Successful",
            users
          ); // Instantiate baseResponse and convert values to native objects.
          res.json(queryResponse.toObject());
        }
      });
  } catch (e) {
    console.log(e);
    res
      .status(500)
      .send(
        new ErrorResponse("500", "Internal server error", e.message).toObject()
      );
  }
});

// findAllByID API
router.get("/:id", async (req, res) => {
  try {
    // get one user by id
    User.findOne({ _id: req.params.id }, function (err, user) {
      // if there is an error
      if (err) {
        console.log(err); // log the error
        // return an error response
        const findByIdMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        // send the error response
        res.status(500).send(findByIdMongodbErrorResponse.toObject());
        // if there is no error
      } else {
        console.log(user); // log the user
        // return a success response
        const findByIdResponse = new BaseResponse(
          200,
          "Query successful",
          user
        );
        // send the response
        res.json(findByIdResponse.toObject());
      }
    });
    // if there is an error
  } catch (e) {
    console.log(e); // log the error
    // return an error response
    const findByIdCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    // send the error response
    res.status(500).send(findByIdCatchErrorResponse.toObject());
  }
});

// createUser API
router.post("/", async (req, res) => {
  try {
    let hashedPassword = bcrypt.hashSync(req.body.password, saltRounds); // salt/hash the password
    standardRole = {
      role: "standard",
    };

    // user object
    let newUser = {
      userName: req.body.userName,
      password: hashedPassword,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phoneNumber: req.body.phoneNumber,
      email: req.body.email,
      addressLineOne: req.body.addressLineOne,
      addressLineTwo: req.body.addressLineTwo,
      city: req.body.city,
      state: req.body.state,
      zip: req.body.zip,
      role: standardRole,
      selectedSecurityQuestions: req.body.selectedSecurityQuestion,
      isDisabled: false,
    };
    // create a new user based off the user object
    User.create(newUser, function (err, user) {
      // error message
      if (err) {
        console.log(err);
        const createUserMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(createUserMongodbErrorResponse.toObject());
      } else {
        // returns json of new user if successful
        console.log(user);
        const createUserResponse = new BaseResponse(
          200,
          "Query successful",
          user
        );
        res.json(createUserResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const createUserCatchErrorResponse = new BaseResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(createUserCatchErrorResponse.toObject());
  }
});

// updateUser API
router.put("/:id", async (req, res) => {
  try {
    // find the user by id
    User.findOne({ _id: req.params.id }, function (err, user) {
      // on error
      if (err) {
        console.log(err);
        const updateUserMongodbErrorResponse = new ErrorResponse(
          500,
          "Internal server error",
          err
        );
        res.status(500).send(updateUserMongodbErrorResponse.toObject());
        // update user if found
      } else {
        console.log(user);

        user.set({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          addressLineOne: req.body.addressLineOne,
          addressLineTwo: req.body.addressLineTwo,
          city: req.body.city,
          state: req.body.state,
          zip: req.body.zip,
          phoneNumber: req.body.phoneNumber,
          email: req.body.email,
        });

        //user role
        user.role.set({
          role: req.body.role,
        });

        // save the user
        user.save(function (err, savedUser) {
          // on error
          if (err) {
            console.log(err);
            const saveUserMongodbErrorResponse = new ErrorResponse(
              500,
              "Internal server error",
              err
            );
            res.status(500).send(saveUserMongodbErrorResponse.toObject());
            // save if valid
          } else {
            console.log(savedUser);
            const saveUserResponse = new BaseResponse(
              200,
              "Query successful",
              savedUser
            );
            res.json(saveUserResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    // catch error
    console.log(e);
    const updateUserCatchErrorResponse = new ErrorResponse(
      500,
      "Internal server error",
      e.message
    );
    res.status(500).send(updateUserCatchErrorResponse.toObject());
  }
});

// delete user API
router.delete("/:id", async (req, res) => {
  try {
    User.findOne({ _id: req.params.id }, function (err, user) {
      if (err) {
        console.log(err);
        const deleteUserMongoDbErrorResponse = new ErrorResponse(
          501,
          "MongoDB Exception Error",
          err
        );
        res.status(501).send(deleteUserMongoDbErrorResponse.toObject());
      } else {
        console.log(user);
        user.set({ isDisabled: true });
        user.save(function (err, savedUser) {
          if (err) {
            console.log(err);
            const savedUserMongoDbErrorResponse = new ErrorResponse(
              500,
              "Internal Server Error",
              err
            );
            res.status(500).send(savedUserMongoDbErrorResponse.toObject());
          } else {
            console.log(savedUser);
            const deleteUserResponse = new BaseResponse(
              200,
              "User successfully deleted",
              user
            );
            res.json(deleteUserResponse.toObject());
          }
        });
      }
    });
  } catch (e) {
    console.log(e);
    const deleteUserCatchErrorResponse = new ErrorResponse(
      500,
      "Internal Server Error",
      e.message
    );
    res.status(500).send(deleteUserCatchErrorResponse.toObject());
  }
});

// find selected security questions API for a specific user
router.get("/:userName/security-questions", async (req, res) => {
  try {
    // finds user by ID
    User.findOne({ userName: req.params.userName }, function (err, user) {
      if (err) {
        // returns server error if error
        console.log(err);
        const findSelectedSecurityQuestionsMongodbErrorResponse =
          new ErrorResponse("500", "Internal Server Error", err);
        res
          .status(500)
          .send(findSelectedSecurityQuestionsMongodbErrorResponse.toObject());
      } else {
        // returns user's security questions if user is found
        console.log(user);
        const findSelectedSecurityQuestionsResponse = new BaseResponse(
          "200",
          "Query successful",
          user.selectedSecurityQuestions
        );
        res.json(findSelectedSecurityQuestionsResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findSelectedSecurityQuestionsCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal Server Error",
      e.message
    );
    res
      .status(500)
      .send(findSelectedSecurityQuestionsCatchErrorResponse.toObject());
  }
});
// Find user role by username
router.get("/:userName/role", async (req, res) => {
  try {
    Role.findOne({ userName: req.params.userName }, function (err, role) {
      // Server Responses
      if (err) {
        console.log(err);
        const findRoleByUserNameErrorResponse = new ErrorResponse(
          "500",
          "internal Server error",
          err
        );
        res.status(500).send(findRoleByUserNameErrorResponse.toObject());
      } else {
        console.log(role);
        const findRoleByUserNameBaseResponse = new BaseResponse(
          "200",
          "Query successful",
          role
        );
        res.json(findRoleByUserNameBaseResponse.toObject());
      }
    });
  } catch (e) {
    console.log(e);
    const findRoleByUserNameCatchErrorResponse = new ErrorResponse(
      "500",
      "Internal server error",
      e.message
    );
    res.status(500).send(findRoleByUserNameCatchErrorResponse.toObject());
  }
});

module.exports = router;
