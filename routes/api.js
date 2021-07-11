'use strict';
const mongoose = require('mongoose');

module.exports = function (app) {
  
  mongoose.connect(process.env.DB, {useNewUrlParser: true, useUnifiedTopology: true });

  const schema = new mongoose.Schema({
    board: {type: String, required: true},
    text: {type: String, required: true },
    delete_password: {type: String, required: true},
    replies: {type: Array, default: [] },
    reported: {type: Boolean, default: false}
  },{
    timestamps: {
      createdAt: 'created_on',
      updatedAt: 'bumped_on'
    }
  });

  const Anon = mongoose.model('Anon', schema);

  app.route('/api/threads/:board')
    .post((req, res) => {
      const board = req.params.board;
      const text = req.body.text;
      const delete_password = req.body.delete_password;

      const anon = new Anon({
        board: board,
        text: text,
        delete_password: delete_password,
      });

      anon.save((err,data) => {
        res.json(data);
      })

    })
    .get((req,res) => {
      const board = req.params.board;
      Anon.find({board: board}, (err, data) => {
        res.json(data.reverse());
      })
    });
    
  app.route('/api/replies/:board');

};
