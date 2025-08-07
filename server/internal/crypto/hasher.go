package crypto

type Hasher interface {
	HashWithSalt(value string, providedSalt ...[]byte) (hash []byte, salt []byte)
	SerializeHashWithSalt(hash []byte, salt []byte) (serializedHash string)
	DeserializeHashWithSalt(serializedHash string) (hash []byte, salt []byte, err error)
	VerifyHashWithSalt(toVerifyRawString, originalHash string) error
}