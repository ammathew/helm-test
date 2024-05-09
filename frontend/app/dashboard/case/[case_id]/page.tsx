'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';


export default function CaseResult(props) {
    const [caseData, setCaseData] = useState(null);

	const temp = props.params.case_id.split('_');
	const caseId = temp.slice(1).join('_');

	useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:8000/cases/' + caseId);
                const data = await response.json();
                setCaseData(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchData();
		const intervalId = setInterval(fetchData, 15000)
		return () => clearInterval(intervalId);
    }, [caseId]);

	return (
		<div>
			{caseData ? (
				<div className="case-result">
					<Typography variant="h6">Status:</Typography>
					<Typography variant="h2">{caseData.procedure_name || 'Loading...'}</Typography>
					<Typography><strong>Case ID:</strong> {caseData.id || 'Loading...'}</Typography>
					<Typography><strong>Status:</strong> {caseData.status || 'Loading...'}</Typography>
					<Typography><strong>Summary:</strong> {caseData.summary || 'Loading...'}</Typography>
					<Typography><strong>CPT Codes:</strong> {caseData.cpt_codes ? caseData.cpt_codes.join(', ') : 'Loading...'}</Typography>
					{caseData.steps ? (
						<TableContainer component={Paper}>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>Key</TableCell>
										<TableCell>Question</TableCell>
										<TableCell>Options</TableCell>
										<TableCell>Reasoning</TableCell>
										<TableCell>Decision</TableCell>
										<TableCell>Next Step</TableCell>
										<TableCell>Is Met</TableCell>
										<TableCell>Is Final</TableCell>
										<TableCell>Evidence</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{caseData.steps.map((step) => (
										<TableRow key={step.key}>
											<TableCell>{step.key}</TableCell>
											<TableCell>{step.question}</TableCell>
											<TableCell>{step.options.join(', ')}</TableCell>
											<TableCell>{step.reasoning}</TableCell>
											<TableCell>{step.decision}</TableCell>
											<TableCell>{step.next_step}</TableCell>
											<TableCell>{step.is_met}</TableCell>
											<TableCell>{step.is_final}</TableCell>
											<TableCell>
												<ul>
													<li>Content: {step.evidence.content}</li>
													<li>Page Number: {step.evidence.page_number}</li>
													<li>PDF Name: {step.evidence.pdf_name}</li>
													<li>Event Datetime: {step.evidence.event_datetime}</li>
												</ul>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</Table>
						</TableContainer>
					) : null}
				</div>
			) : (
				<Typography>Loading...</Typography>
			)}
		</div>
	);
}