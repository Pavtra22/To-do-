package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"

	"todo-backend/database"
	"todo-backend/handlers"

)

func main() {

	// Connect DB
	database.ConnectDB()
	r := chi.NewRouter()

	fmt.Println("Starting Todo API...")

	// ===== Middlewares =====
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000", "http://localhost:5173"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	// ===== Helpful debugging for routing =====
	r.MethodNotAllowed(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("405 MethodNotAllowed:", r.Method, r.URL.Path)
		http.Error(w, "Method Not Allowed", 405)
	})

	r.NotFound(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("404 NotFound:", r.Method, r.URL.Path)
		http.Error(w, "Not Found", 404)
	})

	// ===== Health Check =====
	r.Get("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Todo API is running on port 8080"))
	})

	// ===== TASK ROUTES =====

	// Collection routes
	r.Get("/api/tasks", handlers.GetTasks)
	r.Post("/api/tasks", handlers.CreateTask)

	// Item routes
	r.Get("/api/tasks/{id}", handlers.GetTask)
	r.Put("/api/tasks/{id}", handlers.UpdateTask)
	r.Delete("/api/tasks/{id}", handlers.DeleteTask)

	// ===== Start Server =====
	fmt.Println("Server running on :8080")
	http.ListenAndServe(":8080", r)
}
