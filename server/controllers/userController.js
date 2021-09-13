const mysql = require("mysql");

// Connection Pool
const pool = mysql.createPool({
  connectionLimit: 100,
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

// View Users
exports.view = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID:" + connection.threadId);

    connection.query(
      'SELECT * FROM user WHERE status = "active"',
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          let removedUser = req.query.removed;
          res.render("home", { rows, removedUser });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n");
      }
    );
  });
};

// Find User by Search
exports.find = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID:" + connection.threadId);

    let searchTerm = req.body.search;
    connection.query(
      "SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?",
      ["%" + searchTerm + "%", "%" + searchTerm + "%"],
      (err, rows) => {
        /* When done with th
        e connection, release it*/
        connection.release();

        if (!err) {
          res.render("home", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};

exports.form = (req, res) => {
  console.log("sdfasdfadfadfadf");
  res.render("add-user");
};

//  Add new user
exports.create = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID " + connection.threadId);

    // User the connection
    connection.query(
      "INSERT INTO user SET first_name = ?, last_name = ?, email = ?, comments = ?, phone = ?",
      [first_name, last_name, email, comments, phone],
      (err, rows) => {
        // When done with the connection, relase it
        connection.release();
        if (!err) {
          res.render("add-user", { alert: "User added successfully." });
        } else {
          console.log(err);
        }
        // console.log("The data form user table: \n", rows);
      }
    );
  });
};

//  Edit user
exports.edit = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID:" + connection.threadId);
    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          res.render("edit-user", { rows });
        } else {
          console.log(err);
        }
        // console.log("The data from user table: \n", rows);
      }
    );
  });
};

//  Update user
exports.update = (req, res) => {
  const { first_name, last_name, email, phone, comments } = req.body;
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!

    // User the connection
    connection.query(
      "UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?  WHERE id = ?",
      [first_name, last_name, email, phone, comments, req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          pool.getConnection((err, connection) => {
            if (err) throw err; // not connected!
            console.log("Connected as ID:" + connection.threadId);
            // User the connection
            connection.query(
              "SELECT * FROM user WHERE id = ?",
              [req.params.id],
              (err, rows) => {
                // When done with the connection, release it
                connection.release();
                if (!err) {
                  res.render("edit-user", {
                    rows,
                    alert: `${first_name} has been update.`,
                  });
                } else {
                  console.log(err);
                }
              }
            );
          });
        } else {
          console.log(err);
        }
      }
    );
  });
};

//  Delete user
exports.delete = (req, res) => {
  // pool.getConnection((err, connection) => {
  //   if (err) throw err; // not connected!
  //   console.log("Connected as ID:" + connection.threadId);
  //   // User the connection
  //   connection.query(
  //     "DELETE FROM user WHERE id = ?",
  //     [req.params.id],
  //     (err, rows) => {
  //       // When done with the connection, release it
  //       connection.release();
  //       if (!err) {
  //         res.redirect('/');
  //       } else {
  //         console.log(err);
  //       }
  //     }
  //   );
  // });

  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID:" + connection.threadId);
    connection.query(
      "UPDATE user SET status = ? WHERE id = ?",
      ["removed", req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();
        if (!err) {
          let removedUser = encodeURIComponent("User sucsessefully removed.");
          res.redirect("/?removed=" + removedUser);
        } else {
          console.log(err);
        }

        console.log("The data from user table: ASDASDASDASDAS \n");
      }
    );
  });
};

// ViewAll Users
exports.viewall = (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err; // not connected!
    console.log("Connected as ID:" + connection.threadId);

    connection.query(
      "SELECT * FROM user WHERE id = ?",
      [req.params.id],
      (err, rows) => {
        // When done with the connection, release it
        connection.release();

        if (!err) {
          res.render("view-user", { rows });
        } else {
          console.log(err);
        }
        console.log("The data from user table: \n", rows);
      }
    );
  });
};
