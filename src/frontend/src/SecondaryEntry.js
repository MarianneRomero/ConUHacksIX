import React from 'react';
import { Card } from 'react-bootstrap';

const SecondaryEntry = ({ prompt, response }) => {
    return (
        <Card style={{ width: '18rem', margin: '10px' }}>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <Card.Title>{prompt}</Card.Title>
                <Card.Text>{response}</Card.Text>
            </Card.Body>
        </Card>
    );
};

export default SecondaryEntry;

