package schema

import (
	"time"

	"entgo.io/ent"
	"entgo.io/ent/dialect/entsql"
	"entgo.io/ent/schema/edge"
	"entgo.io/ent/schema/field"
)

// EmailVerification holds the schema definition for the EmailVerification entity.
type EmailVerification struct {
	ent.Schema
}

// Fields of the EmailVerification.
func (EmailVerification) Fields() []ent.Field {
	return []ent.Field{
		field.String("token_hash").Unique(),
		field.Time("expires_at"),
		field.Time("created_at").Default(time.Now),
	}
}

// Edges of the EmailVerification.
func (EmailVerification) Edges() []ent.Edge {
	return []ent.Edge{
		edge.From("user", User.Type).
			Ref("email_verifications").
			Required().
			Unique().
			Annotations(entsql.OnDelete(entsql.Cascade)),
	}
}
