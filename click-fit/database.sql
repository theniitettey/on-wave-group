CREATE TABLE IF NOT EXISTS users (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    active BOOLEAN DEFAULT TRUE
);

DELIMITER //

DROP PROCEDURE IF EXISTS addUser//

CREATE PROCEDURE addUser(
    IN p_email VARCHAR(255),
    IN p_password VARCHAR(255),
    IN p_type VARCHAR(50),
    IN p_active BOOLEAN
)
BEGIN
    INSERT INTO users (email, password, type, active)
    VALUES (p_email, p_password, p_type, p_active);
END //

DELIMITER ;

CALL addUser('testuser@clickfit.com', 'securepassword123', 'admin', TRUE);
CALL addUser('athlete@clickfit.com', 'athletepass456', 'member', TRUE);
