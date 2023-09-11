INSERT INTO tb_users (
    uuid,
    name,
    password,
    age,
    address,
    phone,
    hobies
)
VALUES (
    @UUID,
    @Name,
    @Password,
    @Age,
    @Adress,
    @Phone,
    @Hobies
)