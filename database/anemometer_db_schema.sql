--Cleanup script
DROP TABLE IF EXISTS anemometer;

--Creating the anemometer table
CREATE TABLE anemometer (
	index INTEGER PRIMARY KEY,
	date DATE NOT NULL,
	hour INTEGER NOT NULL,
	minute_bin VARCHAR NOT NULL,
	wspd_mps_2d REAL NOT NULL,
	wspd_mph_2d REAL NOT NULL,
	wdr_cos_2d REAL NOT NULL,
	wdr_sin_2d REAL NOT NULL,
	temp_C_2d REAL NOT NULL,
	temp_F_2d REAL NOT NULL,
	wdr_2d REAL NOT NULL,
	wspd_mps_3d REAL NOT NULL,
	wspd_mph_3d REAL NOT NULL,
	wdr_cos_3d REAL NOT NULL,
	wdr_sin_3d REAL NOT NULL,
	welv REAL NOT NULL,
	temp_C_3d REAL NOT NULL,
	temp_F_3d REAL NOT NULL,
	wdr_3d REAL NOT NULL,
	wspd_mps_diff REAL NOT NULL,
	wspd_mph_diff REAL NOT NULL,
	wdr_diff REAL NOT NULL,
	temp_C_diff REAL NOT NULL,
	temp_F_diff REAL NOT NULL,
	wdr_3d_by10 REAL NOT NULL,
	wspd_mps_3d_by1 REAL NOT NULL, 
	wspd_mph_3d_by1 REAL NOT NULL,
	temp_F_3d_by1 REAL NOT NULL,
	wdr_3d_corr REAL NOT NULL
);


SELECT * FROM anemometer;