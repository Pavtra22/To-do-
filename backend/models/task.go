package models

type Task struct {
	TaskID     uint   `json:"task_id" gorm:"primaryKey;column:task_id"`
	UserID     uint   `json:"user_id" gorm:"column:user_id"`
	Title      string `json:"title" gorm:"column:title"`
	Priority   string `json:"priority" gorm:"column:priority"`
	DueDate    string `json:"due_date" gorm:"column:due_date"`
	IsComplete int    `json:"is_completed" gorm:"column:is_completed"`
	CreatedAt  string `json:"created_at" gorm:"column:created_at"`
}

func (Task) TableName() string {
	return "tasks"
}
