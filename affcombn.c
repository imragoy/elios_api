//
// affcombn
// by ImraGoy
// imragoy@gmail.com
// 05/10/2017
//

void    my_putchar(char c)
{
    write(1, &c, 1);
}

void    putnbr(int nb)
{
    if (nb > 0) {
        putnbr(nb / 10);
        my_putchar(nb % 10 + 48);
    }
}

int    power(int nb, int pow)
{
    int i = -1;

    while (++i < pow)
        nb *= 10;
    return (nb);
}

int     next_nb(int nb, int size)
{
    int cnt = 0;
    
    while (++cnt <= size)
        while ((nb / power(1, cnt - 1)) % 10 <= (nb / power(1, cnt)) % 10) {
            nb++;
            cnt = 1;
        }
    return (nb);
}

int     main(int ac, char **av)
{
    int size = (av[1] ? av[1][0] - '0' : 1);
    int nb = next_nb(1, size);
    
    while (nb < power(1, size)) {
        putnbr(nb);
        nb = next_nb(nb + 1, size);
        (nb < power(1, size) ? write(1, ", ", 2) : 0);
    }
    return (write(1, "\n", 1), 0);
}
