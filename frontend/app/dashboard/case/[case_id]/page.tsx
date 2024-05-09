'use client'

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation'
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { Card, CardContent, CardHeader, FormControlLabel, Checkbox } from '@material-ui/core';

const useStyles = makeStyles({
	gridContainer: {
	  width: 400,
	},
  });



export default function CaseResult(props) {
    const [caseData, setCaseData] = useState(null);

	const temp = props.params.case_id.split('_');
	const caseId = temp.slice(1).join('_');

	const classes = useStyles();

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
				<div style={{ marginTop: '20px' }}>
					<Card className="case-result" style={{ marginBottom: '20px' }}>
						<CardHeader title={caseData.procedure_name || 'Loading...'} />
						<CardContent>
							<Typography><strong>Status:</strong> {caseData.status || 'Loading...'}</Typography>
							<Typography><strong>Determination:</strong>{caseData.is_met !== undefined ? (caseData.is_met ? 'True' : 'False') : 'Loading...'}</Typography>
							<Typography><strong>CPT Codes:</strong> {caseData.cpt_codes ? caseData.cpt_codes.join(', ') : 'Loading...'}</Typography>
						</CardContent>
					</Card>
					{caseData.steps ? (
						caseData.steps.map((step) => (
							<Card style={{ marginBottom: '20px' }}>
								<CardHeader title={step.question} />
								<CardContent>
									{step.options && step.options.length > 0 ? (
										step.options.map((option, index) => (
											<div>
												<FormControlLabel
													key={index}
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
					) : null
					}
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
				<Typography>Loading...</Typography>
			)
			}
		</div >
	);


}