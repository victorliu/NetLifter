#!/usr/bin/env perl
use strict;

while(<>){
	chomp;
	if(/include\s+(\S+)/){
		my $filename = $1;
		if($filename =~ /\.js$/){
			#system("uglifyjs $filename");
			system("cat $filename");
		}else{
			system("cat $filename");
		}
	}else{
		print "$_\n";
	}
}
