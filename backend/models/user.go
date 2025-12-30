package models

type User struct {
	UserID    uint   `json:"user_id" gorm:"primaryKey;column:user_id"`
	EmailID   string `json:"email_id" gorm:"column:email_id"`
	Password  string `json:"password" gorm:"column:password"`
	CreatedAt string `json:"created_at" gorm:"column:created_at"`
}

func (User) TableName() string {
	return "users"
}
