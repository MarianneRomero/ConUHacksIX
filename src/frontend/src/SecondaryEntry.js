import React from 'react';
import { Card } from 'react-bootstrap';

const SecondaryEntry = ({ prompt, response }) => {
    return (
        <Card>
            <Card.Img variant="top" src="holder.js/100px180" />
            <Card.Body>
                <h3>{prompt}</h3>
                <text>{response}</text>
            </Card.Body>
        </Card>
    );
};

export default SecondaryEntry;

