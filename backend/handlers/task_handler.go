package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/go-chi/chi/v5"
	"todo-backend/database"
	"todo-backend/models"
)
func GetTasks(w http.ResponseWriter, r *http.Request) {
	tasks := make([]models.Task, 0) // <-- important change

	database.DB.Find(&tasks)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(tasks)
}

func GetTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var task models.Task
	result := database.DB.First(&task, id)

	if result.Error != nil {
		http.NotFound(w, r)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}
func CreateTask(w http.ResponseWriter, r *http.Request) {
	var task models.Task
	json.NewDecoder(r.Body).Decode(&task)

	database.DB.Create(&task)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}
func UpdateTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	var task models.Task
	database.DB.First(&task, id)

	json.NewDecoder(r.Body).Decode(&task)

	database.DB.Save(&task)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(task)
}
func DeleteTask(w http.ResponseWriter, r *http.Request) {
	id := chi.URLParam(r, "id")

	database.DB.Delete(&models.Task{}, id)

	w.WriteHeader(http.StatusNoContent)
}
