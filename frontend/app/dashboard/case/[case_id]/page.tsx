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
				<Card className="case-result">
					<CardHeader title={caseData.procedure_name || 'Loading...'} />
					<CardContent>
						<Grid container direction="column" className={classes.gridContainer}>
							<Grid item container justify="space-between">
								<Grid item>
									<Typography variant="h6">Status</Typography>
									<Typography variant="body1">{caseData.status || 'Loading...'}</Typography>
								</Grid>
								<Grid item>
									<Typography variant="h6">Determination</Typography>
									<Typography variant="body1">{caseData.is_met !== undefined ? (caseData.is_met ? 'True' : 'False') : 'Loading...'}</Typography>
								</Grid>
							</Grid>
						</Grid>
						<Typography><strong>Summary:</strong> {caseData.summary || 'Loading...'}</Typography>
						<Typography><strong>CPT Codes:</strong> {caseData.cpt_codes ? caseData.cpt_codes.join(', ') : 'Loading...'}</Typography>
						{caseData.steps ? (
							caseData.steps.map((step) => (
								<Card>
									<CardHeader title={step.question} />
									<CardContent>

										<Card title={step.question}>
											<CardContent>
												{step.options && step.options.length > 0 ? (
													step.options.map((option, index) => (
														<div>
															<FormControlLabel
																key={index}
																control={<Checkbox />}
																label={option.text}
															/>
														</div>
													))
												) : null}
											</CardContent>
										</Card>
									</CardContent>
								</Card>
							))
						) : null
						}
					</CardContent >
				</Card >
			) : (
				<Typography>Loading...</Typography>
			)}
		</div>
	);


}