PERL = perl

all:
	$(PERL) builder.pl < netlifter_template.html > netlifter.html
