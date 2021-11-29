const router = require('express').Router();
const { Post, User, Comment} = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/', (req, res) => {
  Post.findAll({
    attributes: ['id', 'title', 'post_txt', 'created_at'],
    order: [['created_at', 'DESC']],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_txt', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  }).then(dbPostData => res.json(dbPostData)).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });  
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'title', 'post_txt', 'created_at'],
    include: [
      {
        model: User,
        attributes: ['username']
      },
      {
        model: Comment,
        attributes: ['id', 'comment_txt', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      }
    ]
  }).then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({ message: 'Nothing found with this ID!'});
      return;
    }res.json(dbPostData);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.post('/', withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_txt: req.body.post_txt,
    user_id: req.session.user_id
  }).then(dbPostData => res.json(dbPostData)).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title,
      post_txt: req.body.post_txt
    },
    {
      where: {
        id: req.params.id
      }
    }
  ).then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({message: 'No post found using this ID'});
      return;
    }res.json(dbPostData);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.delete('/:id', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  }).then(dbPostData => {
    if(!dbPostData) {
      res.status(404).json({ message: 'Nothing found using this id'});
      return;
    }res.json(dbPostData);
  }).catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});


module.exports = router;