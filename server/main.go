//https://www.calhoun.io/using-postgresql-with-go/ - section 3

package main

//the github.com/lib/pq is our driver
import (
	"fmt"
	"net/http"
	"database/sql"
	"encoding/json"

	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

func main() {
	r := mux.NewRouter()
	r.HandleFunc("/api/createUser", createUser)

	http.ListenAndServe(":8080", r)
}

//here are our db configs to connect to the database
const (
	host = "localhost"
	port = 5432
	user = "postgres"
	password = "postgres"
	dbname = "simple"
)

type User struct {
	Name string `json:"name"`
	Password string `json:"password"`
}

func createUser(w http.ResponseWriter, r *http.Request)  {
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
    "password=%s dbname=%s sslmode=disable",
    host, port, user, password, dbname)

	var u User

	err := json.NewDecoder(r.Body).Decode(&u)
    if err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return 
    }

	db, err := sql.Open("postgres", psqlInfo)
	if err != nil {
		panic(err)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		panic(err)
	}

	sqlStatement := `
	INSERT INTO users (name, password)
	VALUES ($1, $2) 
	RETURNING id`
	id := 0
	err = db.QueryRow(sqlStatement, u.Name, u.Password).Scan(&id)
	if err != nil {
  	panic(err)
	}
fmt.Println("New record ID is:", id)

}