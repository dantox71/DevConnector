const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const { check, validationResult } = require("express-validator");
const request = require("request");
const config = require("config");

const Profile = require("../../models/Profile");
const User = require("../../models/User");

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.user.id
    }).populate("user", ["name", "avatar"]);

    //Check if no profile
    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for that user" });
    }

    //Send profile back
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required")
        .not()
        .isEmpty(),
      check("skills", "Skills is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);

    //Check for errors
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }

    //Excract profile data from req.body
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    //Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map(skill => skill.trim());
    }

    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      //Check if authenticated user has already account. if so - that means that he wants to edit his profile.In other case that means that he wants to create a new one.
      if (profile) {
        //Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      } else {
        //Create new profile
        profile = new Profile(profileFields);

        //Save to the database
        await profile.save();

        res.json(profile);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);

    res.json(profiles);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
router.get("/user/:user_id", async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate("user", ["name", "avatar"]);

    if (!profile) return res.status(400).json({ msg: "Profile not found" });

    res.json(profile);
  } catch (err) {
    console.error(err.message);

    if (err.kind === "ObjectId") {
      console.log(err);
      return res.status(400).json({ msg: "Profile not found" });
    }

    res.status(500).send("Server error");
  }
});

// @route   DELETE api/profile
// @desc    Delete profile,user & posts
// @access  Private
router.delete("/", auth, async (req, res) => {
  try {
    //@todo - remove user's posts

    //Remove Profile
    await Profile.findOneAndRemove({ user: req.user.id });
    //Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.send(`User with id ${req.user.id} has been deleted(and his profile)`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/experience
// @desc    Add profile experience
// @access  Private
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is required")
        .not()
        .isEmpty(),
      check("company", "Company is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      //Find a profile of already logged in user
      const profile = await Profile.findOne({ user: req.user.id });

      //Insert new element to the experience array(at the beginning);
      profile.experience.unshift(newExp);

      //Save updated profile in the database
      await profile.save();

      res.json(profile);
      console.log("Experience added");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    Delete expererience from profile
// @access  Private
router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    //Get logged in user's profile
    const profile = await Profile.findOne({ user: req.user.id });

    //Get inde of experience that will be deleted
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    console.log(removeIndex);

    //Check if experience doesn't exist
    if (removeIndex == -1) {
      return res
        .status(400)
        .json({ msg: "Eperience with this id doesn't exist" });
    }

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   PUT api/profile/education
// @desc    Add profile education
// @access  Private
router.put(
  "/education",
  [
    auth,
    [
      check("school", "School is required")
        .not()
        .isEmpty(),
      check("degree", "Degree is required")
        .not()
        .isEmpty(),
      check("fieldofstudy", "Field of study is required")
        .not()
        .isEmpty(),
      check("from", "From date is required")
        .not()
        .isEmpty()
    ]
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      //Find a profile of already logged in user
      const profile = await Profile.findOne({ user: req.user.id });

      //Insert new element to the experience array(at the beginning);
      profile.education.unshift(newEdu);

      //Save updated profile in the database
      await profile.save();

      res.json(profile);
      console.log("Education added");
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   DELETE api/profile/education/:edu_id
// @desc    Delete education from profile
// @access  Private
router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    //Get logged in user's profile
    const profile = await Profile.findOne({ user: req.user.id });

    //Get inde of experience that will be deleted
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    console.log(removeIndex);

    //Check if education doesn't exist
    if (removeIndex == -1) {
      return res
        .status(400)
        .json({ msg: "Education with this id doesn't exist" });
    }

    profile.education.splice(removeIndex, 1);

    await profile.save();

    res.json({ profile });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route   GET api/profile/github/:username
// @desc    Get user repos from Github
// @access  Public
router.get("/github/:username", (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=3&sort=created:asc&client_id=${config.get(
        "githubClientId"
      )}
      &client_secret=${config.get("githubSecret")}`,
      method: "GET",
      headers: { "user-agent": "node.js" }
    };

    request(options, (error, response, body) => {
      if (error) console.error(error);

      //Check if user not found
      if (response.statusCode !== 200) {
        return res.status(404).json({ msg: "User not found" });
      }

      res.json(JSON.parse(body));
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
