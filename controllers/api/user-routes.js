const router = require('express').Router();
const withAuth = require('../../utils/auth');
const { User, Post, Comment } = require('../../models');

router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password']}
  }).then(dbUserData => res.json(dbUserData)).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password']},
    where: {
      id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['id', 'title', 'post_text', 'created_at']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'created_at']
      }
    ]
  }).then(dbUserData => {
    if(!dbUserData) {
      res.status(404).json({ message: 'No user with this ID'});
      return;
    }
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', (req, res) => {
  User.create({
    username: req.body.username,
    password: req.body.password
}).then(dbUserData => {
  req.session.save(() => {
    req.session.user_id = dbUserData.id;
    req.session.username = dbUserData.username;
    req.session.loggedIn = true;

    res.json(dbUserData)
  })
}).catch(err => {
  console.log(err);
  res.status(500).json(err);
});
});

router.post('/login', (req, res) => {
  User.findOne({
    where: {
      username: req.body.username
    }
  }).then(dbUserData => {
    if(!dbUserData) {
      res.status(400).json({ message: 'Username not found' });
      return;
    }
    const validPW = dbUserData.checkPassword(req.body.password);
    if(!validPW) {
      res.status(400).json({ message: 'Incorrect Password !'});
      return;
    }
    req.session.save(() => {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json({ user: dbUserData, message: 'You are logged in!'});
    });
  });
});

router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    })
  } else {
    res.status(404).end();
  }
});

router.put('/:id', (req, res) => {
  User.update(req.body, {
    indivudalHooks: true,
    where: {
      id: req.params.id
    }
  }).then(dbUserData => {
    if(!dbUserData[0]) {
      res.status(404).json({ message: 'No user found using this ID'});
      return;
    }
    res.json(dbUserData);
  }).catch(err => {
    res.status(500).json(err);
  });
});

router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(404).json({ message: 'No uder found with this ID'});
      return;
    }res.json(dbUserData);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;
