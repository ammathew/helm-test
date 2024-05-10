'use client'

import React, { useState, useEffect } from 'react';
import { Typography } from '@material-ui/core';

import { Card, CardContent, CardHeader, FormControlLabel, Checkbox } from '@material-ui/core';
import { availableParallelism } from 'os';

interface CaseResultProps {
	params: {
        case_id: string;
	};
}

interface Option {
	selected: boolean;
	text: string;
}

interface Step {
	question: string;
	options: Option[];
	reasoning: string;
}

interface CaseData {
	procedure_name: string;
	status: string;
	is_met: boolean | null;
	cpt_codes: string[];
	steps: Step[];
	summary: string;
	created_at: string;
	elapsed_time: number;
}

export default function CaseResult(props: CaseResultProps) {
    const [caseData, setCaseData] = useState<CaseData | null>(null);
	const [caseNotFound, setCaseNotFound] = useState(false);
	const caseId = props.params.case_id;

	function formatElapsedTime(seconds: number) {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = (seconds % 60).toFixed(2);
		return `${minutes} minutes, ${remainingSeconds} seconds`;
	}

	useEffect(() => {
		let intervalId: number | undefined = undefined;
		const fetchData = () => {
			fetch('http://localhost:8000/cases/' + caseId)
				.then(response => {
					if (!response.ok) {
						if (response.status === 404) {
							setCaseData(null);
							setCaseNotFound(true);
							clearInterval(intervalId);
						}
						throw new Error(`Network response was not ok, status code: ${response.status}`);

					}
					return response.json();
				})
				.then(data => {
					if(data.status === 'complete'){
						clearInterval(intervalId);
					}
					setCaseData(data);
				})
				.catch(error => {
					console.error('Error:', error);
				});
		};
		if (caseId) {
			fetchData();
			intervalId = window.setInterval(fetchData, 5000);
		}
		return () => {
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [caseId]);

	return (
		<div>
			{caseData ? (
				<div style={{ marginTop: '20px' }}>
					<Card className="case-result" style={{ marginBottom: '20px' }}>
						<CardHeader title={caseData.procedure_name || 'Loading...'} />
						<CardContent>
							<Typography><strong>Status:</strong> {caseData.status || 'Loading...'}</Typography>
							<Typography><strong>Case created on:</strong> {caseData.created_at ? new Date(caseData.created_at).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }) : 'Loading...'}</Typography>
							<Typography>
								<strong>Elapsed time: </strong>
								{caseData.elapsed_time ? formatElapsedTime(caseData.elapsed_time) : 'Loading...'}
							</Typography>
							<Typography>
								<strong>Determination: </strong>
								{caseData.is_met !== null && caseData.is_met !== undefined ? (caseData.is_met ? 'Likely Accepted' : 'Likely Denial') : 'Loading...'}
							</Typography>
							<Typography><strong>CPT Codes:</strong> {caseData.cpt_codes ? caseData.cpt_codes.join(', ') : 'Loading...'}</Typography>
						</CardContent>
					</Card>
					{caseData.steps ? (
						caseData.steps.map((step, index) => (
							<Card key={index} style={{ marginBottom: '20px' }}>
								<CardHeader title={step.question} />
								<CardContent>
									{step.options && step.options.length > 0 ? (
										step.options.map((option, optionIndex) => (
											<div key={`${index}-${optionIndex}`}>
												<FormControlLabel
													control={<Checkbox checked={option.selected} disabled={!option.selected} />}
													label={option.text}
												/>
											</div>
										))
									) : null}
									{step.reasoning}
								</CardContent>
							</Card>
						))
					) : null}
					<Card className="case-result" style={{ marginBottom: '20px', backgroundColor: caseData.is_met ? 'green' : '#FFB6C1' }}>
						<CardContent>
							<Typography style={{ fontSize: '2em', color: caseData.is_met ? 'green' : 'red' }}>
								{caseData.is_met ? 'Likely Met' : 'Likely Denial'}
							</Typography>
							<Typography>{caseData.summary || 'Loading...'}</Typography>
						</CardContent>
					</Card>
				</div >
			) : (
				<Typography>
					{caseNotFound ? 'Case not found' : 'Loading...'}
				</Typography>
			)
			}
		</div >
	);


}