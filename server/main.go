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

type User struct {
	Id int `json:"id"`
	Name string `json:"name"`
	Password string `json:"password"`
}

//here are our db configs to connect to the database
const (
	host = "localhost"
	port = 5432
	user = "postgres"
	password = "postgres"
	dbname = "simple"
)
//assigning the db globally so all functions can access it
var db *sql.DB


func main() {
	initDB()
	r := mux.NewRouter()
	r.HandleFunc("/api/createUser", createUser)
	r.HandleFunc("/api/getUser/{id}", getUser)

	http.ListenAndServe(":8080", r)
}

//initializing my database
func initDB() {
	var err error
	psqlInfo := fmt.Sprintf("host=%s port=%d user=%s "+
     "password=%s dbname=%s sslmode=disable",
      host, port, user, password, dbname)

	  //ran into ALOT of errors here because I was writing: db, err := sql.... which was assigning db to a local variable, not assigning it to the global variable which it is doing now.
	db, err = sql.Open("postgres", psqlInfo)
	  	if err != nil {
	  		panic(err)
	   	}
	if err != nil {
		panic(err)
	}
	//don't defer db.close() or else you'll spend 6 HOURS!!!!! trying to figure out why its not working
	err = db.Ping()
		if err != nil {
		panic(err)
		}
	fmt.Println("CONNECTED TO DB")
}

func createUser(w http.ResponseWriter, r *http.Request) {
	u := &User{}
	err := json.NewDecoder(r.Body).Decode(u)
	if err != nil {
		fmt.Println("REQUEST BODY ERROR")
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	fmt.Println(u.Name)
	fmt.Println(u.Password)

	sqlStatement :=`
	INSERT INTO users (name, password)
	VALUES ($1, $2)`
	
	fmt.Println("test", u)
	_, err = db.Exec(sqlStatement, u.Name, u.Password)
	if err != nil {
  		fmt.Println(err)
	}
}

func getUser(w http.ResponseWriter, r *http.Request) {
	//declaring an instance of the User struct as "u"
	u := &User{}
	//creates a map of variables found in the URL path
	vars := mux.Vars(r)
	//assigns a the var qid to the value found at the URL path of {id}
	qid := vars["id"]

	//creating variables that will store the values from the Query Scan function
	var id int
	var name string
	var password string

	//Query statement that will be requesting from the DB
	sqlStatement :=`
	SELECT * FROM users WHERE id = $1`

	//QueryRow returns at most 1 row, and Scan can be attached here as it takes in a row and copies the columns from the DB into your Memory locations(&) above.
	err := db.QueryRow(sqlStatement, qid).Scan(&id, &name, &password)
	if err != nil {
		fmt.Println(err)
  }
  	//setting our User struct to the values we just queried. json.Encode only takes in a struct/interface
  	u.Id = id
	u.Name = name
	u.Password = password
	fmt.Println(u)

	//setting our header to JSON so our frontend knows what its retrieving
	w.Header().Set("Content-Type", "application/json")

	//Encoding our User Struct to JSON and sending it through our responseWriter
    err = json.NewEncoder(w).Encode(u)
	if err != nil {
		fmt.Println(err)
  }
}
