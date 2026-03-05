package schema

import (
	"entgo.io/ent"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

type User struct {
	ent.Schema
}

func (User) Fields() []ent.Field {
	return []ent.Field{
		field.String("username"),
		field.String("email").Unique(),
		field.String("password_hash").Optional().Nillable(),
		field.String("auth_provider").Optional().Nillable(),
		field.Bool("email_verified").Default(false),
	}
}

func (User) Edges() []ent.Edge {
	return []ent.Edge{
		edge.To("email_verifications", EmailVerification.Type),
	}
}
