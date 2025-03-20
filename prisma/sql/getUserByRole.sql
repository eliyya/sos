-- @param {BigInt} $1:role
SELECT * 
    FROM "users"
    WHERE ("role" & $1) != 0