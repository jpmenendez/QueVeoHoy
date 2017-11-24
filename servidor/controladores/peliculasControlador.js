var con = require('../lib/conexionbd');

// Busca todas las películas en la bdd
function buscarPeliculas(req, res) {
  console.log("Hello");
  var filtro = "";

  if (req.query.cantidad) {
    var limite = req.query.cantidad;
  }else {
    var limite = 52;
  }

  if (req.query.pagina) {
    var inicio = (req.query.pagina - 1) * limite;
  }else {
    var inicio = 0;
  }

  if (req.query.anio) {
    console.log("Hello anio");
    var anio = req.query.anio;
    filtro = "AND anio = " + anio;
  }

  if (req.query.titulo) {
    var titulo = req.query.titulo;
    filtro = "AND titulo LIKE '%" + titulo + "%'";
  }

  if (req.query.genero) {
    var genero = req.query.genero;
      filtro = "AND genero_id = " + genero;
  }

  var sql = "SELECT * FROM pelicula WHERE 1=1 " + filtro + " LIMIT " + inicio + "," + limite;
  console.log("SQL query:  " + sql);
  con.query(sql, function(error, resultado_peliculas, fields) {
    if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }

    var sql2 = "SELECT COUNT(*) AS total FROM pelicula WHERE 1=1 " + filtro
    console.log("SQL query 2: " + sql2);
    con.query(sql2, function(error, total, fields) {
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }
      var response = {
        //NOTA: la función query siempre devuelve un array con cada una de las filas,
        //si el resultado está compuesto de una sola fila, para acceder a ella vas a tener que hacerlo accediendo a la primera posición del array
          'total': total[0].total
      };

      response.peliculas = resultado_peliculas;
      res.send(JSON.stringify(response));
    });
  });
}

// Busca todos los géneros de las películas en la bdd
function buscarGeneros(req, res) {
    var sql = "select * from genero"
    con.query(sql, function(error, resultado, fields) {
        if (error) {
            console.log("Hubo un error en la consulta", error.message);
            return res.status(404).send("Hubo un error en la consulta");
        }
        var response = {
            'generos': resultado
        };

        res.send(JSON.stringify(response));
    });
}


module.exports = {
    buscarPeliculas: buscarPeliculas,
    buscarGeneros: buscarGeneros,
};
