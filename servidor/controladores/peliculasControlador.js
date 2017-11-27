var con = require('../lib/conexionbd');

// Busca todas las películas en la bdd
function buscarPeliculas(req, res) {
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
    var anio = req.query.anio;
    filtro += "AND anio = " + anio;
  }

  if (req.query.titulo) {
    var titulo = req.query.titulo;
    filtro += "AND titulo LIKE '%" + titulo + "%'";
  }

  if (req.query.genero) {
    var genero = req.query.genero;
      filtro += "AND genero_id = " + genero;
  }

  if (req.query.columna_orden) {
    var columnaOrden = req.query.columna_orden;
    filtro += " ORDER BY " + columnaOrden + " ";
  }

  if(req.query.tipo_orden){
    var tipoOrden = req.query.tipo_orden;
    filtro += tipoOrden;
  }

  var sql = "SELECT * FROM pelicula WHERE 1=1 " + filtro + " LIMIT " + inicio + "," + limite + ";";

  con.query(sql, function(error, resultado_peliculas, fields) {
    if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }

    var sql2 = "SELECT COUNT(*) AS total FROM pelicula WHERE 1=1 " + filtro;
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

//Busca la información de una película en la bdd
function buscarPelicula(req, res) {
  var id = req.params.id;

  var sql = "SELECT * FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE pelicula.id = " + id + ";";
  var sql2 = "SELECT nombre FROM actor JOIN actor_pelicula ON actor.id = actor_id " +
  " JOIN pelicula ON pelicula.id = pelicula_id WHERE pelicula.id = " + id +";";

  con.query(sql, function(error, resultadoInfo, fields){
    if (error) {
        console.log("Hubo un error en la consulta", error.message);
        return res.status(404).send("Hubo un error en la consulta");
    }

    con.query(sql2, function(error, resultadoActores, fields){
      if (error) {
          console.log("Hubo un error en la consulta", error.message);
          return res.status(404).send("Hubo un error en la consulta");
      }

      var response = {
        'pelicula': resultadoInfo[0]
      }

      response.actores = resultadoActores;

      if (resultadoInfo.length == 0) {
        res.status(404).send("Hubo un error en la consulta");
      }else {
        res.send(JSON.stringify(response));
      }

    });
  });
}

  //Recomienda películas
  function recomendarPelicula(req, res){

    var filtro = "";

    if (req.query.anio_inicio && req.query.anio_fin) {
      filtro += "AND pelicula.anio BETWEEN " + req.query.anio_inicio + " AND " +
                req.query.anio_fin;
    }

    if (req.query.genero){
      filtro += " AND nombre ='" + req.query.genero + "'";
    }

    if (req.query.puntuacion) {
      filtro += " AND puntuacion = " + req.query.puntuacion;
    }

    var sql = "SELECT pelicula.titulo, pelicula.poster, pelicula.trama, pelicula.id, genero.nombre" +
              " FROM pelicula JOIN genero ON pelicula.genero_id = genero.id WHERE 1=1 " + filtro +
              " ";
              console.log("Consulta realizada:" + sql);
    con.query(sql, function(error, resultado, fields){
      if (error) {
          console.log("Hubo un error en la consultaaaaa", error.message);
          return res.status(404).send("Hubo un error en la consultaaaa");
      }

      console.log("Resultado de la consulta abajo |@|")
      console.log(resultado);
      var response = {
        'peliculas': resultado
      }
      res.send(JSON.stringify(response));
    });
  }


module.exports = {
    buscarPeliculas: buscarPeliculas,
    buscarGeneros: buscarGeneros,
    buscarPelicula: buscarPelicula,
    recomendarPelicula: recomendarPelicula
};
